import { responseData, responseError } from '../../utils/response.js'
import { ticketModel } from '../models/ticket.model.js'
import { productModel } from '../models/product.model.js'
import { Ticket } from '../patterns/ticket.pattern.js'

class TicketMongo {
  async getAll (page, limit) {
    try {
      const result = await ticketModel.paginate({}, { page, limit, lean: true })
      return responseData(200, result)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async getOne (tid) {
    try {
      const exist = await ticketModel.findById({ _id: tid }).lean()
      if (!exist) return responseError(404, null, 'Ticket Not Found')

      return responseData(200, exist)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }

  async create (obj) {
    try {
      const { user, products } = obj
      const code = Math.random().toString(36).substring(0, 10)
      let ammount = 0
      for (const item of products) {
        const quantity = item.quantity
        const price = item.product.price
        ammount += quantity * price
      }
      const infoProducts = products.map(e => {
        return { _id: e.product._id, product: e.product.title, price: e.product.price, quantity: e.quantity }
      })
      const newTicket = new Ticket(code, ammount, user, infoProducts)

      for (const item of products) {
        const product = await productModel.findOne({ _id: item.product._id })
        if (product.stock < item.quantity) return responseError(400, null, `Product sold out of ${item.product.title} quantity ${item.quantity}`)
        product.stock = product.stock - item.quantity
        await productModel.updateOne({ _id: item.product._id }, product)
      }

      const result = await ticketModel.create(newTicket)
      return responseData(201, result)
    } catch (error) {
      return responseError(500, null, 'Internal Server Error')
    }
  }
}

export const ticketMongo = new TicketMongo()
