import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.bigInteger('phone').notNullable()
      table.date('birth_date').notNullable()
      table.string('gender').notNullable()
      table.string('occupation').notNullable()
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.string('remember_me_token').nullable()

      table
        .uuid('professional_id')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
