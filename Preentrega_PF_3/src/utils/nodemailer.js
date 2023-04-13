import nodemailer from 'nodemailer'

import { PASS_NODEMAILER } from '../config/config.js'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: true,
  auth: {
    user: 'aldairgome97@gmail.com',
    pass: PASS_NODEMAILER
  }
})
