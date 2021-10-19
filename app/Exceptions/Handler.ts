import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.status(404).json({
        status: 'error',
        message: 'Not found or does not exist!',
      })
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return ctx.response.status(400).json({
        status: 'error',
        message: 'It is not possible to register with existing data!',
        details: error.sqlMessage,
      })
    }

    if (error.status === 401) {
      return ctx.response.status(401).json({
        status: 'error',
        message: 'Expired Token/Unauthorized Access!',
      })
    }

    return super.handle(error, ctx)
  }
}
