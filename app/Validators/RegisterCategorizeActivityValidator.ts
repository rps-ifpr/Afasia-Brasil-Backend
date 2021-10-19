import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterCategorizeActivityValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    category_id: schema.string(),
    secondary_category: schema.string(),
    name: schema.string(),
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
