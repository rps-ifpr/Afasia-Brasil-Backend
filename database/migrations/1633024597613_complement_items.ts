import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ComplementItems extends BaseSchema {
  protected tableName = 'complement_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('activity_id')
        .notNullable()
        .references('id')
        .inTable('activities')
        .onDelete('CASCADE')

      table.boolean('is_response').defaultTo(false)

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
