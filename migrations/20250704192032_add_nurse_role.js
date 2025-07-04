/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    ALTER TABLE users 
    DROP CONSTRAINT users_role_check,
    ADD CONSTRAINT users_role_check 
    CHECK (role IN ('admin', 'doctor', 'patient', 'nurse'))
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE users 
    DROP CONSTRAINT users_role_check,
    ADD CONSTRAINT users_role_check 
    CHECK (role IN ('admin', 'doctor', 'patient'))
  `);
};
