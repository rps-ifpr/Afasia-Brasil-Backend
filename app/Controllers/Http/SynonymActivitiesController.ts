import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import Activity from 'App/Models/Activity'
import SynonymItem from 'App/Models/SynonymItem'
import { excludeFileUploaded } from 'App/utils/localStorage'
import RegisterSynonymActivityValidator from 'App/Validators/RegisterSynonymActivityValidator'
import crypto from 'crypto'

const url = `${Env.get('API_URL')}`

export default class SynonymActivitiesController {
  public async index() {
    const activities = await Activity.query().where(
      'activity_type',
      'sinonimos'
    )

    const serializedActivities = activities.map((activity) => {
      return {
        ...activity.$attributes,
        thumbnail: `${url}/uploads/images/${activity.thumbnail}`,
      }
    })

    return serializedActivities
  }

  public async create({ request }: HttpContextContract) {
    let { name, sentence, legend, is_response } = request.body()
    const thumbnail = request.file('thumbnail')
    const images = request.files('image')

    await request.validate(RegisterSynonymActivityValidator)

    if (
      images.length !== 5 ||
      legend.length !== 5 ||
      is_response.length !== 5
    ) {
      throw new AppErrorException(
        'Five images and their legends are required to register!',
        400
      )
    }

    const activityAlreadyExists = await Activity.query()
      .where('name', name.toUpperCase())
      .andWhere('activity_type', 'sinonimos')

    if (activityAlreadyExists[0]) {
      throw new AppErrorException('Activity already exists!', 400)
    }

    try {
      await Database.transaction(async (trx) => {
        const activity = new Activity()

        await thumbnail?.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`)

        activity.merge({
          activity_type: 'sinonimos',
          name: name.toUpperCase(),
          thumbnail: thumbnail?.fileName,
          sentence: sentence.toUpperCase(),
        })

        activity.useTransaction(trx)
        await activity.save()

        for (let image of images) {
          const fileHash =
            crypto.randomBytes(16).toString('hex') + `.${image.extname}`

          await activity.related('synonym_items').create({
            activity_id: activity.id,
            image: fileHash,
            legend: legend.shift().toUpperCase(),
            is_response: is_response.shift(),
          })

          await image.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`, {
            name: fileHash,
          })
        }
      })
    } catch (error) {
      throw new AppErrorException(
        'Unexpected error while creating new activity.',
        400
      )
    }

    throw new AppSuccessException('Activity created successfully!', 201)
  }

  // List activity details
  public async show({ request }: HttpContextContract) {
    const activity_id = request.input('activity_id')

    const activityExists = await Activity.query()
      .where('id', activity_id)
      .preload('synonym_items')

    if (!activityExists[0]) {
      throw new AppErrorException('Activity does not exists!', 404)
    }

    const serializedDetails = activityExists.map((activity: Activity) => {
      return {
        id: activity.id,
        name: activity.name,
        thumbnail: `${url}/uploads/images/${activity.thumbnail}`,
        sentence: activity.sentence,
        created_at: activity.created_at,
        updated_at: activity.updated_at,
        items: activity.synonym_items.map((item: SynonymItem) => {
          return {
            id: item.id,
            legend: item.legend,
            is_response: item.is_response,
            image: `${url}/uploads/images/${item.image}`,
            sound: `${url}/uploads/sounds/${item.sound}`,
          }
        }),
      }
    })

    return serializedDetails
  }

  public async update({ request, params }: HttpContextContract) {
    const { legend } = request.body()
    const sounds = request.files('sound')

    if (sounds.length !== 5) {
      throw new AppErrorException('Five sounds are required!', 400)
    }

    await Activity.findByOrFail('id', params.activity_id)

    for (let sound of sounds) {
      const fileHash =
        crypto.randomBytes(16).toString('hex') + `.${sound.extname}`

      const item = {
        sound: fileHash,
        legend: legend.shift(),
      }

      sound.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/sounds`, {
        name: fileHash,
      })

      const itemExists = await SynonymItem.findBy('legend', item.legend)

      if (itemExists && itemExists.activity_id === params.activity_id) {
        itemExists.sound = item.sound

        await itemExists.save()
      }
    }

    throw new AppSuccessException('Activity updated successfully!', 200)
  }

  public async destroy({ params }: HttpContextContract) {
    const activityExists = await Activity.findByOrFail('id', params.activity_id)

    await excludeFileUploaded({
      file: activityExists.thumbnail,
      folder: 'images',
    })

    await activityExists.delete()

    throw new AppSuccessException('Activity deleted successfully!', 200)
  }
}
