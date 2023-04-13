import { cartService } from '../../dao/services/cart.service.js'

export const HandleGetAll = async (req, res) => {
  try {
    const result = await cartService.getAll()
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleGetOne = async (req, res) => {
  try {
    const { cid } = req.params
    const result = await cartService.getOne(cid)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleCreate = async (req, res) => {
  try {
    const result = await cartService.create()
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleUpdate = async (req, res) => {
  try {
    const { cid } = req.params

    const result = await cartService.update(cid, req.body)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleDelete = async (req, res) => {
  try {
    const { cid } = req.params
    const result = await cartService.delete(cid)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}

export const HandlePurchase = async (req, res) => {
  try {
    const { cid } = req.params
    const { user, products } = req.body
    const result = await cartService.purchase(cid, user, products)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}

export const HandleProductGet = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const result = await cartService.productAdd(cid, pid)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}

export const HandleProductAdd = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const result = await cartService.productAdd(cid, pid)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleProductUpdate = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const result = await cartService.productUpdate(cid, pid, req.body)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
export const HandleProductRemove = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const result = await cartService.productRemove(cid, pid)
    res.status(result.status).json(result)
  } catch (error) {
    res.sendStatus(500)
  }
}
