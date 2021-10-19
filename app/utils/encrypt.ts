import crypto from 'crypto'

export function encrypt(extname: any) {
  return crypto.randomBytes(16).toString('hex') + `.${extname}`
}
