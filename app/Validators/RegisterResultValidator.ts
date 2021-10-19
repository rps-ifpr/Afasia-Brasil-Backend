import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterResultValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    activity_id: schema.string(),
    errors: schema.number(),
    acerts: schema.number(),
    time: schema.string(),
    reaction: schema.enum(['gostou', 'nao gostou']),
    sound: schema.boolean(),
    legend: schema.boolean(),
    supervised: schema.boolean(),
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
