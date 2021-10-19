import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Results extends BaseSchema {
  protected tableName = 'results'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .uuid('activity_id')
        .notNullable()
        .references('id')
        .inTable('activities')
        .onDelete('CASCADE')

      table.integer('errors').notNullable()
      table.integer('acerts').notNullable()
      table.time('time').notNullable()
      table.string('reaction').notNullable()
      table.boolean('sound').notNullable()
      table.boolean('legend').notNullable()
      table.boolean('supervised').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
