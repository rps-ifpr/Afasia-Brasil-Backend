import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AuthenticationValidator from 'App/Validators/AuthenticationValidator'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class SessionsController {
  public async create({ request, auth }: HttpContextContract) {
    const { email, password } = request.body()

    await request.validate(AuthenticationValidator)

    try {
      const token = await auth
        .use('api')
        .attempt(email, password, { expiresIn: Env.get('AUTH_EXPIRES_IN') })

      const user = await User.findBy('email', email)

      return {
        user: {
          id: user?.id,
          occupation: user?.occupation.toLowerCase(),
        },
        token,
      }
    } catch {
      throw new AppErrorException('Email/password is incorrect!', 400)
    }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return { revoked: true }
  }
}
