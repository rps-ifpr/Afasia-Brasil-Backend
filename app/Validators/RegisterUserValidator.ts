import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterUserValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    // User
    name: schema.string(),
    email: schema.string({}, [rules.email()]),
    phone: schema.number(),
    birth_date: schema.string({}, [
      rules.regex(/(\d{4})[-.\/](\d{2})[-.\/](\d{2})/),
    ]),
    password: schema.string(),
    gender: schema.enum(['masculino', 'feminino']),
    occupation: schema.string(),
    professional_id: schema.string.optional(),

    // UserAddress
    place: schema.string(),
    district: schema.string(),
    uf: schema.string({}, [rules.maxLength(2)]),
    city: schema.string(),
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
