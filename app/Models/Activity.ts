import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import AntonymsItem from './AntonymsItem'
import Category from './Category'
import ComplementItem from './ComplementItem'
import RelateItem from './RelateItem'
import SynonymItem from './SynonymItem'

export default class Activity extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public category_id: string

  @belongsTo(() => Category, { foreignKey: 'category_id' })
  public category: BelongsTo<typeof Category>

  @column()
  public secondary_category?: string

  @belongsTo(() => Category, { foreignKey: 'secondary_category' })
  public complementary_category: BelongsTo<typeof Category>

  @column()
  public activity_type: string

  @column()
  public name: string

  @column()
  public thumbnail: string

  @column()
  public sentence?: string

  // Optional
  @hasMany(() => RelateItem, { foreignKey: 'activity_id' })
  public relate_items: HasMany<typeof RelateItem>

  @hasMany(() => SynonymItem, { foreignKey: 'activity_id' })
  public synonym_items: HasMany<typeof SynonymItem>

  @hasMany(() => AntonymsItem, { foreignKey: 'activity_id' })
  public antonym_items: HasMany<typeof AntonymsItem>

  @hasMany(() => ComplementItem, { foreignKey: 'activity_id' })
  public complement_items: HasMany<typeof ComplementItem>
  // Optional

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeCreate()
  public static assignUuid(activity: Activity) {
    activity.id = uuid()
  }
}
