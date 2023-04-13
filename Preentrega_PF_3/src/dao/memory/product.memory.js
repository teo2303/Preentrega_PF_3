import fs from 'fs'

import { responseData, responseError } from '../../utils/response.js'
import { ProductM } from '../patterns/product.pattern.js'
import { Paginate } from '../patterns/paginate.pattern.js'

class ProductMemory {
  constructor () {
    this.path = 'src/dao/db/products.json'
  }

  async getAll (page, limit) {
    try {
      page = parseInt(page)
      limit = parseInt(limit)
      const result = await this.getFile()
      const prev = page * limit - limit
      const hasPrevPage = page > 1
      const hasNextPage = JSON.parse(result).length > limit * page
      const pagingCounter = page
      const prevPage = page <= 1 ? null : page - 1
      const nextPage = JSON.parse(result).length > page * limit ? page + 1 : null
      const totalDocs = JSON.parse(result).length
      const totalPages = JSON.parse(result).length / limit < 1 && JSON.parse(result).length / limit !== 0 ? 1 : JSON.parse(result).length / limit
      return responseData(200, new Paginate(
        JSON.parse(result).splice(prev, limit),
        hasPrevPage,
        hasNextPage,
        limit,
        page,
        pagingCounter,
        prevPage,
        nextPage,
        totalDocs,
        totalPages
      ))
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async getOne (pid) {
    try {
      const result = await this.getFile()
      const exist = await JSON.parse(result).find(e => parseInt(e._id) === parseInt(pid))
      if (!exist) return responseError(404, null, 'Product Not Found')
      return responseData(200, exist)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async create (obj) {
    try {
      if (!(
        obj.title &&
        obj.code &&
        obj.price &&
        obj.stock &&
        obj.category
      )) return responseError(400, null, 'All fields are required')
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))
      let id = await clone.length + 1

      const exist = await clone.find(e => JSON.stringify(e.code) === JSON.stringify(obj.code))
      if (exist) return responseError(422, null, 'The product already exists')
      const existId = await clone.find(e => parseInt(e._id) === parseInt(id))
      if (existId) id = await id + 1

      const product = new ProductM(obj.title, obj.description, obj.code, obj.price, obj.status, obj.stock, obj.category, obj.thumbnails, id)
      await clone.push(product)
      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return responseData(201, product)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async udpate (pid, obj) {
    try {
      if (!(
        pid &&
        obj
      )) return responseError(400, null, 'All fields are required')
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(pid))
      if (!exist) return responseError(404, null, 'Product Not Found')

      exist.title = await obj.title || exist.title
      exist.description = await obj.description || exist.description
      exist.code = await obj.code || exist.code
      exist.price = await obj.price || exist.price
      exist.status = await obj.status || exist.status
      exist.stock = await obj.stock || exist.stock
      exist.category = await obj.category || exist.category
      exist.thumbnails = await obj.thumbnails || exist.thumbnails

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return responseData(200, exist)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async delete (pid) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(pid))
      if (!exist) return responseError(404, null, 'Product Not Found')

      const position = await clone.indexOf(exist)
      await clone.splice(position, 1)

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return responseData(200, { deletedCount: 1 })
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async getFile () {
    const exist = fs.existsSync(this.path)
    if (!exist) await fs.promises.writeFile(this.path, JSON.stringify([]))
    const readfile = await fs.promises.readFile(this.path, 'utf-8')
    if (readfile === '') await fs.promises.writeFile(this.path, JSON.stringify([]))
    return readfile
  }
}

export const productMemory = new ProductMemory()
