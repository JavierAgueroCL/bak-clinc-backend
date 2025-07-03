exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').nullable();
    table.enum('role', ['admin', 'doctor', 'patient']).defaultTo('patient');
    table.boolean('is_active').defaultTo(true);
    table.boolean('email_verified').defaultTo(false);
    table.string('reset_password_token').nullable();
    table.timestamp('reset_password_expires').nullable();
    table.string('email_verification_token').nullable();
    table.timestamp('email_verification_expires').nullable();
    table.timestamp('last_login').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};