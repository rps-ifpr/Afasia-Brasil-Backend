import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import UserAddress from './UserAddress'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public phone: number

  @column()
  public birth_date: Date

  @column()
  public gender: string

  @column()
  public occupation: string

  @column()
  public is_admin: boolean

  @column()
  public professional_id?: string

  @hasOne(() => UserAddress, { foreignKey: 'user_id' })
  public address: HasOne<typeof UserAddress>

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
