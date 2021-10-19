import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GenericActivities extends BaseSchema {
  protected tableName = 'activities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('activity_type').notNullable()

      table
        .uuid('category_id')
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')

      table
        .uuid('secondary_category')
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('thumbnail').notNullable()
      table.string('sentence').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
