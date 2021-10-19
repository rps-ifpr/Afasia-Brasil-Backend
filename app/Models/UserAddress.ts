import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import User from './User'

export default class UserAddress extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public place: string

  @column()
  public district: string

  @column()
  public uf: string

  @column()
  public city: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeCreate()
  public static assignUuid(address: UserAddress) {
    address.id = uuid()
  }
}
