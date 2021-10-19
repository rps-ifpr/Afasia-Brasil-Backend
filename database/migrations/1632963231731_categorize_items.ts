import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryItems extends BaseSchema {
  protected tableName = 'categorize_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('category_id')
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')

      table.boolean('is_reference').defaultTo(false)

      table.string('legend').notNullable()
      table.string('image').notNullable()
      table.string('sound').nullable()

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
