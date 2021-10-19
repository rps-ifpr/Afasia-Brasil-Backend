import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import Activity from 'App/Models/Activity'
import AntonymsItem from 'App/Models/AntonymsItem'
import { encrypt } from 'App/utils/encrypt'

export default class AntonymItemsController {
  public async create({ request }: HttpContextContract) {
    let { activity_id, legend } = request.body()

    const images = request.files('image')
    const sounds = request.files('sound')

    const activityExists = await Activity.findByOrFail('id', activity_id)

    if (activityExists.activity_type !== 'antonimos') {
      throw new AppErrorException('This activity is not an anonymous.', 400)
    }

    if (legend.length !== 2 || images.length !== 2 || sounds.length !== 2) {
      throw new AppErrorException(
        'Two images and their legends are required to register!',
        400
      )
    }

    const first_image = encrypt(images[0].extname)
    const first_sound = encrypt(sounds[0].extname)
    const second_image = encrypt(images[1].extname)
    const second_sound = encrypt(sounds[1].extname)

    const first_item = await AntonymsItem.create({
      activity_id,
      pair_id: 'waiting...',
      legend: legend[0].toUpperCase(),
      image: first_image,
      sound: first_sound,
    })

    const second_item = await AntonymsItem.create({
      activity_id,
      pair_id: first_item.id,
      legend: legend[1].toUpperCase(),
      image: second_image,
      sound: second_sound,
    })

    first_item.pair_id = second_item.id

    await first_item.save()

    await images[0].moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`, {
      name: first_image,
    })

    await images[1].moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`, {
      name: second_image,
    })

    await sounds[0].moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/sounds`, {
      name: first_sound,
    })

    await sounds[1].moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/sounds`, {
      name: second_sound,
    })

    throw new AppSuccessException('Items created successfully!', 201)
  }
}
