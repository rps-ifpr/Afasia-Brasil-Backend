import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import Activity from 'App/Models/Activity'
import ComplementItem from 'App/Models/ComplementItem'
import { encrypt } from 'App/utils/encrypt'
import { excludeFileUploaded } from 'App/utils/localStorage'
import RegisterComplementActivityValidator from 'App/Validators/RegisterComplementActivityValidator'
import crypto from 'crypto'

const url = `${Env.get('API_URL')}`

export default class ComplementActivitiesController {
  public async index() {
    const activities = await Activity.query().where(
      'activity_type',
      'complemento'
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
    let { name, sentence, legend } = request.body()
    const thumbnail = request.file('thumbnail')
    const images = request.files('image')
    const sound = request.file('sound')

    await request.validate(RegisterComplementActivityValidator)

    if (images.length !== 4 || legend.length !== 4) {
      throw new AppErrorException(
        'Four images and their legends are required to register!',
        400
      )
    }

    if (!sound) {
      throw new AppErrorException('Sound is required!', 400)
    }

    const activityAlreadyExists = await Activity.query()
      .where('name', name.toUpperCase())
      .andWhere('activity_type', 'complemento')

    if (activityAlreadyExists[0]) {
      throw new AppErrorException('Activity already exists!', 400)
    }

    try {
      await Database.transaction(async (trx) => {
        const activity = new Activity()

        await thumbnail?.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`)

        activity.merge({
          activity_type: 'complemento',
          name: name.toUpperCase(),
          thumbnail: thumbnail?.fileName,
          sentence: sentence.toUpperCase(),
        })

        activity.useTransaction(trx)
        await activity.save()

        const sound_hash = encrypt(sound.extname)

        for (let image of images) {
          const fileHash =
            crypto.randomBytes(16).toString('hex') + `.${image.extname}`

          await activity.related('complement_items').create({
            activity_id: activity.id,
            image: fileHash,
            sound: image === images[0] ? sound_hash : undefined,
            legend: legend.shift().toUpperCase(),
            is_response: image === images[0] && true,
          })

          await image.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`, {
            name: fileHash,
          })
        }

        await sound.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/sounds`, {
          name: sound_hash,
        })
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
      .preload('complement_items')

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
        items: activity.complement_items.map((item: ComplementItem) => {
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

  public async destroy({ request }: HttpContextContract) {
    const activity_id = request.input('activity_id')

    const activityExists = await Activity.findByOrFail('id', activity_id)

    await excludeFileUploaded({
      file: activityExists.thumbnail,
      folder: 'images',
    })

    await activityExists.delete()

    throw new AppSuccessException('Activity deleted successfully!', 200)
  }
}
