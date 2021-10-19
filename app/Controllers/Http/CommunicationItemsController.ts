import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppErrorException from 'App/Exceptions/AppErrorException'
import CommunicationItem from 'App/Models/CommunicationItem'
import { excludeFileUploaded } from 'App/utils/localStorage'

const url = `${Env.get('API_URL')}`

export default class CommunicationItemsController {
  // List of items i want
  public async index() {
    const items = await CommunicationItem.query()
      .where('i_want', true)
      .orderBy('created_at', 'desc')

    const serializedItems = items.map((item) => {
      return {
        ...item.$attributes,
        image: `${url}/uploads/images/${item.image}`,
        sound: `${url}/uploads/sounds/${item.sound}`,
      }
    })

    return serializedItems
  }

  // Create communication item
  public async create({ request }: HttpContextContract) {
    let { legend, i_want } = request.body()
    legend = legend.toUpperCase()

    const imageField = request.file('image')
    const soundField = request.file('sound')

    const itemAlreadyExists = await CommunicationItem.findBy('legend', legend)

    if (itemAlreadyExists) {
      throw new AppErrorException('Communication item already exists!', 400)
    }

    if (imageField && soundField) {
      await imageField.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`)
      await soundField.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/sounds`)
    } else {
      throw new AppErrorException('Image and sound are required!', 400)
    }

    const item = await CommunicationItem.create({
      i_want,
      legend: legend,
      image: imageField?.fileName,
      sound: soundField?.fileName,
    })

    return item
  }

  // Communications Items (Yes or No)
  public async show() {
    const items = await CommunicationItem.query()
      .where('legend', 'SIM')
      .orWhere('legend', 'NÃO')
      .orWhere('legend', 'TALVEZ')

    const serializedItems = items.map((item) => {
      return {
        ...item.$attributes,
        image: `${url}/uploads/images/${item.image}`,
        sound: `${url}/uploads/sounds/${item.sound}`,
      }
    })

    return serializedItems
  }

  // Delete communication item
  public async destroy({ params }: HttpContextContract) {
    const { item_id } = params

    const itemExists = await CommunicationItem.findByOrFail('id', item_id)

    await excludeFileUploaded({
      file: itemExists.image as string,
      folder: 'images',
    })

    await excludeFileUploaded({
      file: itemExists.sound as string,
      folder: 'sounds',
    })

    await itemExists.delete()
  }
}
