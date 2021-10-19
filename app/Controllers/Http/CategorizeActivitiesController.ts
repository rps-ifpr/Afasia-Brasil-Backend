import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import Activity from 'App/Models/Activity'
import CategorizeItem from 'App/Models/CategorizeItem'
import Category from 'App/Models/Category'
import { excludeFileUploaded } from 'App/utils/localStorage'
import RegisterCategorizeActivityValidator from 'App/Validators/RegisterCategorizeActivityValidator'

const url = `${Env.get('API_URL')}`

export default class CategorizeActivitiesController {
  public async index() {
    const activities = await Activity.query().where(
      'activity_type',
      'categorize'
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
    let { category_id, secondary_category, name } = request.body()
    const thumbnail = request.file('thumbnail')

    await request.validate(RegisterCategorizeActivityValidator)

    name.toUpperCase()

    const categoriesExists = await Category.query()
      .where('id', category_id)
      .orWhere('id', secondary_category)

    if (categoriesExists.length !== 2) {
      throw new AppErrorException('Category/Categories does not exists!', 400)
    }

    if (category_id === secondary_category) {
      throw new AppErrorException('The categories should be different.', 400)
    }

    const activityAlreadyExists = await Activity.query()
      .where('name', name.toUpperCase())
      .andWhere('activity_type', 'categorize')

    if (activityAlreadyExists[0]) {
      throw new AppErrorException('Activity already exists!', 400)
    }

    await thumbnail?.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`)

    await Activity.create({
      category_id,
      secondary_category,
      activity_type: 'categorize',
      name: name,
      thumbnail: thumbnail?.fileName,
    })

    throw new AppSuccessException('Activity created successfully!', 201)
  }

  // List activity details
  public async show({ request }: HttpContextContract) {
    const activity_id = request.input('activity_id')

    const activityExists = await Activity.findByOrFail('id', activity_id)

    let categories = [] as Category[]

    if (activityExists.secondary_category) {
      categories = await Category.query()
        .where('id', activityExists.category_id)
        .orWhere('id', activityExists.secondary_category)
        .preload('items')
    }

    const serializedDetails = categories.map((category: Category) => {
      return {
        ...category.$attributes,
        items: category.items.map((item: CategorizeItem) => {
          return {
            id: item.id,
            legend: item.legend,
            category_id: item.category_id,
            is_reference: item.is_reference,
            image: `${url}/uploads/images/${item.image}`,
            sound: `${url}/uploads/sounds/${item.sound}`,
          }
        }),
      }
    })

    return serializedDetails
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
