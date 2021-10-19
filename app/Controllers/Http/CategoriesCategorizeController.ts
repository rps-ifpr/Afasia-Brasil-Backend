import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import CategorizeItem from 'App/Models/CategorizeItem'
import Category from 'App/Models/Category'
import { excludeFileUploaded } from 'App/utils/localStorage'
import RegisterCategoryValidator from 'App/Validators/RegisterCategoryValidator'
import crypto from 'crypto'

type ItemProps = {
  image: string
  legend: string
  is_reference?: boolean
}
export default class CategoriesCategorizeController {
  public async index() {
    return await Category.all()
  }

  public async create({ request }: HttpContextContract) {
    let { name, legend } = request.body()
    const images = request.files('image')

    name.toUpperCase()

    await request.validate(RegisterCategoryValidator)

    if (images.length < 4 || legend.length < 4) {
      throw new AppErrorException(
        'Four images and their legends are required to register!',
        400
      )
    }

    const categoryAlreadyExists = await Category.findBy('name', name)

    if (categoryAlreadyExists) {
      throw new AppErrorException('Category already exists!', 400)
    }

    const items = [] as ItemProps[]
    for (let image of images) {
      const fileHash =
        crypto.randomBytes(16).toString('hex') + `.${image.extname}`

      items.push({
        image: fileHash,
        legend: legend.shift(),
        is_reference: image === images[0] && true,
      })

      await image.moveToDisk(`${Env.get('STORAGE_FOLDER_PATH')}/images`, {
        name: fileHash,
      })
    }

    try {
      await Database.transaction(async (trx) => {
        const category = new Category()

        category.merge({ name: name.toUpperCase() })

        category.useTransaction(trx)
        await category.save()

        for (let item of items) {
          await category.related('items').create({
            category_id: category.id,
            image: item.image,
            legend: item.legend.toUpperCase(),
            is_reference: item.is_reference,
          })
        }
      })
    } catch (error) {
      throw new AppErrorException(
        'Unexpected error while creating new category.',
        400
      )
    }

    throw new AppSuccessException('Category created successfully!', 201)
  }

  public async update({ request, params }: HttpContextContract) {
    const { legend } = request.body()
    const sounds = request.files('sound')

    if (sounds.length < 2) {
      throw new AppErrorException('At least two item is required!', 400)
    }

    await Category.findByOrFail('id', params.category_id)

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

      const itemExists = await CategorizeItem.findBy('legend', item.legend)

      if (itemExists && itemExists.category_id === params.category_id) {
        if (item.sound) {
          await excludeFileUploaded({
            file: item.sound as string,
            folder: 'sounds',
          })
        }

        itemExists.sound = item.sound

        await itemExists.save()
      }
    }

    throw new AppSuccessException('Category updated successfully!', 200)
  }

  public async destroy({ params }: HttpContextContract) {
    const { category_id } = params

    const categoryExists = await Category.findByOrFail('id', category_id)

    const categoryItems = await CategorizeItem.query().where(
      'category_id',
      category_id
    )

    for (let item of categoryItems) {
      await excludeFileUploaded({
        file: item.image,
        folder: 'images',
      })

      if (item.sound) {
        await excludeFileUploaded({
          file: item.sound as string,
          folder: 'sounds',
        })
      }
    }

    await categoryExists.delete()

    throw new AppSuccessException('Category deleted successfully!', 200)
  }
}
