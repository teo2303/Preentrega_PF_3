import { responseData, responseError } from '../../utils/response.js'
import { productModel } from '../models/product.model.js'
import { Product } from '../patterns/product.pattern.js'

class ProductMongo {
  async getAll (page, limit) {
    try {
      const result = await productModel.paginate({}, { page, limit, lean: true })
      return responseData(200, result)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async getOne (pid) {
    try {
      const exist = await productModel.findById({ _id: pid }).lean()
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
      const exist = await productModel.findOne({ code: obj.code })
      if (exist) return responseError(422, null, 'The product already exists')

      const product = new Product(obj.title, obj.description, obj.code, obj.price, obj.status, obj.stock, obj.category, obj.thumbnails)
      const result = await productModel.create(product)

      return responseData(201, result)
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
      const exist = await productModel.findById(pid)
      if (!exist) return responseError(404, null, 'Product Not Found')

      exist.title = obj.title || exist.title
      exist.description = obj.description || exist.description
      exist.code = obj.code || exist.code
      exist.price = obj.price || exist.price
      exist.status = obj.status
      exist.stock = obj.stock || exist.stock
      exist.category = obj.category || exist.category
      exist.thumbnails = obj.thumbnails || exist.thumbnails

      const result = await productModel.updateOne({ _id: pid }, exist)
      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return responseError(202, null, 'Not modified')
      return responseData(200, exist)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async delete (pid) {
    try {
      const exist = await productModel.findById(pid)
      if (!exist) return responseError(404, null, 'Product Not Found')

      const result = await productModel.deleteOne({ _id: pid })
      const { deletedCount } = result
      if (!(deletedCount > 0)) return responseError(202, null, 'Not deleted')
      return responseData(200, result)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }
}

export const productMongo = new ProductMongo()
