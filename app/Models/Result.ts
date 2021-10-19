import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import GenericActivity from './Activity'
import User from './User'

export default class Result extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public activity_id: string

  @belongsTo(() => GenericActivity)
  public activity: BelongsTo<typeof GenericActivity>

  @column()
  public errors: number

  @column()
  public acerts: number

  @column()
  public time: string

  @column()
  public reaction: string

  @column()
  public sound: boolean

  @column()
  public legend: boolean

  @column()
  public supervised: boolean

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @beforeCreate()
  public static assignUuid(result: Result) {
    result.id = uuid()
  }
}
