import jwt from 'jsonwebtoken'
import { JWT_SESSION_SECRET } from '../config/config.js'

import { userService } from '../dao/services/user.service.js'

const validateSession = async (req, res, next, path) => {
  if (!req.cookies.jwt) {
    req.session = null
    return res.redirect(`${path}`)
  }
  const session = jwt.verify(req.cookies.jwt, JWT_SESSION_SECRET)
  const { email } = session
  const user = await userService.getOne(email)
  if (user.status === 404) return res.redirect(`${path}`)
  return next()
}

const validateUser = async (req, res, next, role) => {
  const session = jwt.verify(req.cookies.jwt, JWT_SESSION_SECRET)
  if (session.role !== role) return res.sendStatus(401)
  return next()
}

const existSession = async (req, res, next, path) => {
  if (req.cookies.jwt) {
    const session = jwt.verify(req.cookies.jwt, JWT_SESSION_SECRET)
    const { email } = session
    const user = await userService.getOne(email)
    if (user.status === 404) {
      res.clearCookie('jwt')
      return res.redirect(`${path}`)
    }
  }
  return next()
}

export const requireApiSession = async (req, res, next) => await validateSession(req, res, next, '/error')
export const requireViewSession = async (req, res, next) => await validateSession(req, res, next, '/signin')

export const requireAuthRoleAdmin = async (req, res, next) => await validateUser(req, res, next, 'admin')
export const requireAuthRoleUser = async (req, res, next) => await validateUser(req, res, next, 'usuario')

export const requireExistSession = async (req, res, next) => await existSession(req, res, next, '/products')
