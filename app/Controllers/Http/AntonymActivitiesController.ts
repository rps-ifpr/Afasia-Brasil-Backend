import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import Activity from 'App/Models/Activity'
import AntonymsItem from 'App/Models/AntonymsItem'
import { excludeFileUploaded } from 'App/utils/localStorage'
import RegisterAntonymActivityValidator from 'App/Validators/RegisterAntonymActivityValidator'

const url = `${Env.get('API_URL')}`

export default class AntonymActivitiesController {
  public async index() {
    const activities = await Activity.query().where(
      'activity_type',
      'antonimos'
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
    let { name } = request.body()
    const thumbnail = request.file('thumbnail')

    await request.validate(RegisterAntonymActivityValidator)

    const activityAlreadyExists = await Activity.query()
      .where('name', name.toUpperCase())
      .andWhere('activity_type', 'antonimos')

    if (activityAlreadyExists[0]) {
      throw new AppErrorException('Activity already exists!', 400)
    }

    await thumbnail?.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`)

    await Activity.create({
      activity_type: 'antonimos',
      name: name.toUpperCase(),
      thumbnail: thumbnail?.fileName,
    })

    throw new AppSuccessException('Activity created successfully!', 201)
  }

  // List activity details
  public async show({ request }: HttpContextContract) {
    const activity_id = request.input('activity_id')

    const activityExists = await Activity.query()
      .where('id', activity_id)
      .preload('antonym_items')

    if (!activityExists[0]) {
      throw new AppErrorException('Activity does not exists!', 404)
    }

    const serializedDetails = activityExists.map((activity: Activity) => {
      return {
        id: activity.id,
        name: activity.name,
        thumbnail: `${url}/uploads/images/${activity.thumbnail}`,
        created_at: activity.created_at,
        updated_at: activity.updated_at,
        items: activity.antonym_items.map((item: AntonymsItem) => {
          return {
            id: item.id,
            legend: item.legend,
            pair_id: item.pair_id,
            image: `${url}/uploads/images/${item.image}`,
            sound: `${url}/uploads/sounds/${item.sound}`,
          }
        }),
      }
    })

    if (serializedDetails[0].items.length !== 10) {
      const pairs = (10 - serializedDetails[0].items.length) / 2

      throw new AppErrorException(
        `Activity is still in development. There are still ${pairs} of items left.`,
        400
      )
    }

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
