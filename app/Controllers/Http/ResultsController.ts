import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppErrorException from 'App/Exceptions/AppErrorException'
import AppSuccessException from 'App/Exceptions/AppSuccessException'
import GenericActivity from 'App/Models/Activity'
import Result from 'App/Models/Result'
import User from 'App/Models/User'
import RegisterResultValidator from 'App/Validators/RegisterResultValidator'
import SearchResultValidator from 'App/Validators/SearchResultValidator'

interface IRequest {
  activity_id: string
  errors: number
  pointing: number
  time: string
  reaction: string
  sound: boolean
  legend: boolean
  supervised: boolean
}

type IDirectionProps = 'asc' | 'desc' | undefined

export default class ResultsController {
  public async create({ request, auth }: HttpContextContract) {
    const body = request.body() as IRequest
    const { $attributes } = auth.use('api').user!

    const user_id = $attributes.id

    await request.validate(RegisterResultValidator)

    await GenericActivity.findByOrFail('id', body.activity_id)

    let user = await User.find(user_id)

    if (user?.occupation !== 'paciente') {
      throw new AppErrorException(
        'Apenas pacientes podem finalizar atividades!',
        400
      )
    }

    await Result.create({ user_id, ...body })

    throw new AppSuccessException('Resultado enviado com sucesso!', 201)
  }

  public async show({ request }: HttpContextContract) {
    const user_id = request.input('user_id') as string
    const activity_type = request.input('activity_type') as string

    // Mais erros e menos erro / mais tempo e menos tempo
    const orderBy = request.input('orderBy') as string
    const reaction = request.input('reaction') as string

    const startDate = request.input('startDate') as string
    const endDate = request.input('endDate') as string

    await request.validate(SearchResultValidator)

    await User.findByOrFail('id', user_id)

    const activity = await GenericActivity.findByOrFail(
      'activity_type',
      activity_type
    )

    let ordination: string = 'anything'

    if (orderBy === 'mais erros') ordination = 'errors desc'
    if (orderBy === 'menos erros') ordination = 'errors asc'

    if (orderBy === 'mais tempo') ordination = 'time desc'
    if (orderBy === 'menos tempo') ordination = 'time asc'

    if (orderBy === 'indefinido') ordination = 'created_at desc'

    const [column, direction] = ordination.split(' ')

    let results: Result[] = []

    if (!startDate && !endDate && orderBy) {
      results = await Result.query()
        .where('user_id', user_id)
        .andWhere('activity_id', activity.id)
        .orderBy(column, direction as IDirectionProps)
    }

    if (startDate && endDate && orderBy) {
      results = await Result.query()
        .where('user_id', user_id)
        .andWhere('activity_id', activity.id)
        .andWhereBetween('created_at', [
          `${startDate}T00:00:00.000-03:00`,
          `${endDate}T00:00:00.000-03:00`,
        ])
        .orderBy(column, direction as IDirectionProps)
    }

    if (reaction !== 'indefinido') {
      results = results.filter((result: Result) => {
        if (!!reaction && result.reaction === reaction) {
          return result
        }
      })
    }

    return results
  }
}
