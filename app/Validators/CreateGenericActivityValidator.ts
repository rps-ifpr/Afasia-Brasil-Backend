import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateGenericActivityValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    activity_type: schema.enum([
      'categorize',
      'relacione',
      'sinonimos',
      'antonimos',
      'complemento',
    ]),
    name: schema.string(),
    category_id: schema.string(),
    secondary_category: schema.string.optional(),
    sentence: schema.string.optional(),
    thumbnail: schema.file(),
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
