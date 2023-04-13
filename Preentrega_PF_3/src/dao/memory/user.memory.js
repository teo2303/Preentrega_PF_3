import fs from 'fs'

import { responseData, responseError } from '../../utils/response.js'
import { UserM } from '../patterns/user.pattern.js'
import { createHash, isValidPassword } from '../../utils/hash.js'
import { cartMemory } from './cart.memory.js'
import { Paginate } from '../patterns/paginate.pattern.js'

class UserMemory {
  constructor () {
    this.path = 'src/dao/db/users.json'
  }

  async signin (email, password) {
    try {
      if (!email) return responseError(400, null, 'All fields are required')
      const result = await this.getFile()

      const exist = await JSON.parse(result).find(e => e.email === email)
      if (!exist) return responseError(404, null, 'User Not Found')

      if (exist.password === null) return responseError(400, null, 'This user does not have a password')
      const valid = isValidPassword(exist, password)
      if (!valid) return responseError(422, null, 'Invalid password')
      const user = {
        fullname: exist.fullname,
        first_name: exist.first_name,
        last_name: exist.last_name,
        email: exist.email,
        age: exist.age,
        cart: exist.cart,
        role: exist.role
      }

      return responseData(200, user)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
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

  async getOne (email) {
    try {
      const result = await this.getFile()
      const exist = await JSON.parse(result).find(e => e.email === email)
      if (!exist) return responseError(404, null, 'User Not Found')
      return responseData(200, exist)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async create (obj) {
    try {
      if (!(
        obj.first_name &&
        obj.email
      )) return responseError(400, null, 'All fields are required')
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))
      let id = await clone.length + 1

      const exist = await clone.find(e => e.email === obj.email)
      if (exist) return responseError(422, null, 'User already exists')
      const existId = await clone.find(e => parseInt(e._id) === parseInt(id))
      if (existId) id = await id + 1

      const cart = await cartMemory.create()
      const { payload } = cart
      let user
      if (obj.password) user = new UserM(obj.first_name, obj.last_name, obj.email, obj.age, createHash(obj.password), payload._id, 'usuario', id)
      else user = new UserM(obj.first_name, obj.last_name, obj.email, obj.age, null, payload._id, 'usuario', id)

      await clone.push(user)
      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return responseData(201, user)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async update (email, obj) {
    try {
      if (!(
        email &&
        obj.obj
      )) return responseError(400, null, 'All fields are required')
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => e.email === obj.email)
      if (!exist) return responseError(404, null, 'User Not Found')

      exist.first_name = await obj.first_name || exist.first_name
      exist.last_name = await obj.last_name || exist.last_name
      exist.age = await obj.age || exist.age
      exist.password = await obj.password || exist.password
      exist.role = await obj.role || exist.role

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return responseData(200, exist)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async delete (email) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => e.email === email)
      if (!exist) return responseError(404, null, 'User Not Found')

      const positionUser = await clone.indexOf(exist)
      await clone.splice(positionUser, 1)

      const result = await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return responseData(200, result)
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

export const userMemory = new UserMemory()
