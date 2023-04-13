import { productService } from '../../dao/services/product.service.js'

export const HandleGetAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const result = await productService.getAll(page, limit)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleGetOne = async (req, res) => {
  try {
    const { pid } = req.params

    const result = await productService.getOne(pid)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleCreate = async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const obj = { title, description, code, price, status, stock, category, thumbnails }
    const result = await productService.create(obj)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleUpdate = async (req, res) => {
  try {
    const { pid } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const obj = { title, description, code, price, status, stock, category, thumbnails }
    const result = await productService.udpate(pid, obj)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleDelete = async (req, res) => {
  try {
    const { pid } = req.params
    const result = await productService.delete(pid)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
