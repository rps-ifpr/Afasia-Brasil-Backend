import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import User from 'App/Models/User'
import UserAddress from 'App/Models/UserAddress'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

interface IUserRequest {
  name: string
  email: string
  phone: number
  birth_date: Date
  password: string
  gender: string
  occupation: string
  professional_id?: string
}

interface IAddressRequest {
  place: string
  district: string
  uf: string
  city: string
}

export default class UsersController {
  public async index() {
    const professionals = await User.query()
      .whereNot('occupation', 'Paciente')
      .orderBy('created_at', 'desc')

    const serializedData = professionals.map((item: User) => {
      return {
        id: item.id,
        name: item.name,
      }
    })

    return serializedData
  }

  public async create({ request }: HttpContextContract) {
    let userBody = request.only([
      'name',
      'email',
      'phone',
      'birth_date',
      'password',
      'gender',
      'occupation',
      'professional_id',
    ]) as IUserRequest

    const addressBody = request.only([
      'place',
      'district',
      'uf',
      'city',
    ]) as IAddressRequest

    userBody.occupation = userBody.occupation.toLowerCase()

    await request.validate(RegisterUserValidator)

    const userAlreadyExists = await User.findBy('email', userBody.email)

    if (userAlreadyExists) {
      throw new AppErrorException('User already exists!', 400)
    }

    try {
      await Database.transaction(async (trx) => {
        const user = new User()

        user.merge(userBody)

        user.useTransaction(trx)
        await user.save()

        const address = new UserAddress()

        address.merge({ ...addressBody, user_id: user.id })

        address.useTransaction(trx)
        await address.save()
      })
    } catch (error) {
      throw new AppErrorException(
        'Unexpected error while creating new user.',
        400
      )
    }

    throw new AppSuccessException('Created!', 201)
  }

  public async show({ auth }: HttpContextContract) {
    const { $attributes } = auth.use('api').user!

    const patients = await User.query()
      .where('occupation', 'Paciente')
      .andWhere('professional_id', $attributes.id)
      .preload('address')
      .orderBy('created_at', 'desc')

    const serializedPatients = patients.map((patient) => {
      return {
        id: patient.id,
        name: patient.name,
        phone: patient.phone,
        birth_date: patient.birth_date,
        gender: patient.gender,
        occupation: patient.occupation,
        created_at: patient.created_at,
        address: patient.address,
      }
    })

    return serializedPatients
  }
}
