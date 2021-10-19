import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SearchResultValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    user_id: schema.string(),
    activity_type: schema.enum([
      'categorize',
      'relacione',
      'sinonimos',
      'antonimos',
      'complemento',
    ]),

    orderBy: schema.enum([
      'mais erros',
      'menos erros',
      'mais tempo',
      'menos tempo',
      'indefinido',
    ]),

    reaction: schema.enum(['gostou', 'não gostou', 'indefinido']),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
