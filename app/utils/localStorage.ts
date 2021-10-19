import fs from 'fs'
import Env from '@ioc:Adonis/Core/Env'
import { resolve } from 'path'

interface IRequest {
  file: string
  folder: string
}

export async function excludeFileUploaded({
  file,
  folder,
}: IRequest): Promise<void> {
  let filename = resolve(__dirname, '..', '..', 'uploads', folder, file)

  if (Env.get('NODE_ENV') === 'production') {
    filename = resolve(__dirname, '..', '..', '..', 'uploads', folder, file)
  }

  try {
    await fs.promises.stat(filename)
  } catch {
    return
  }

  await fs.promises.unlink(filename)
}
