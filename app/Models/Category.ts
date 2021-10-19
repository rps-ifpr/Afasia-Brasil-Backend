import {
  BaseModel,
  beforeCreate,
  column,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import CategorizeItem from './CategorizeItem'

export default class Category extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @hasMany(() => CategorizeItem, { foreignKey: 'category_id' })
  public items: HasMany<typeof CategorizeItem>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeCreate()
  public static assignUuid(category: Category) {
    category.id = uuid()
  }
}
