import { responseData, responseError } from '../../utils/response.js'
import { userModel } from '../models/user.model.js'
import { User } from '../patterns/user.pattern.js'
import { createHash, isValidPassword } from '../../utils/hash.js'
import { cartMongo } from './cart.mongo.js'

class UserMongo {
  async signin (email, password) {
    try {
      if (!email) return responseError(400, null, 'All fields are required')
      const exist = await userModel.findOne({ email })
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
      const result = await userModel.paginate({}, { page, limit, lean: true })
      return responseData(200, result)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async getOne (email) {
    try {
      const exist = await userModel.findOne({ email }).lean()
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
      const exist = await userModel.findOne({ email: obj.email })
      if (exist) return responseError(422, null, 'User already exists')

      const cart = await cartMongo.create()
      const { payload } = cart
      let user
      if (obj.password) user = new User(obj.first_name, obj.last_name, obj.email, obj.age, createHash(obj.password), payload._id, obj.role)
      else user = new User(obj.first_name, obj.last_name, obj.email, obj.age, null, payload._id, obj.role)
      const result = await userModel.create(user)
      return responseData(201, result)
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
      const exist = await userModel.findOne({ email })
      if (!exist) return responseError(404, null, 'User Not Found')

      exist.first_name = obj.first_name || exist.first_name
      exist.last_name = obj.last_name || exist.last_name
      exist.age = obj.age || exist.age
      exist.password = obj.password || exist.password
      exist.role = obj.role || exist.role

      const result = await userModel.updateOne({ email }, exist)
      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return responseError(202, null, 'Not modified')
      return responseData(200, exist)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async delete (email) {
    try {
      const exist = await userModel.findOne({ email })
      if (!exist) return responseError(404, null, 'User Not Found')

      const result = await userModel.deleteOne({ email })
      const { deletedCount } = result
      if (!(deletedCount > 0)) return responseError(202, null, 'Not deleted')
      return responseData(200, result)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }
}

export const userMongo = new UserMongo()
