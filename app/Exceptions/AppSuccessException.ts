import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new AppSuccessException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AppSuccessException extends Exception {
  public async handle(success: this, ctx: HttpContextContract) {
    ctx.response.status(success.status).json({
      status: 'success',
      message: success.message,
    })
  }
}
