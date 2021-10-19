import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class CategorizeItem extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public category_id: string

  @column()
  public is_reference: boolean

  @column()
  public legend: string

  @column()
  public image: string

  @column()
  public sound?: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeCreate()
  public static assignUuid(categorizeItem: CategorizeItem) {
    categorizeItem.id = uuid()
  }
}
