const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  
  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await knex('users').insert([
    {
      email: 'admin@example.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      phone: null,
      role: 'admin',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'doctor1@example.com',
      password: hashedPassword,
      first_name: 'María',
      last_name: 'González',
      phone: '+34 600 123 456',
      role: 'doctor',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'doctor2@example.com',
      password: hashedPassword,
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      phone: '+34 600 234 567',
      role: 'doctor',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'doctor3@example.com',
      password: hashedPassword,
      first_name: 'Ana',
      last_name: 'Martínez',
      phone: '+34 600 345 678',
      role: 'doctor',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'nurse1@example.com',
      password: hashedPassword,
      first_name: 'Juan',
      last_name: 'Pérez',
      phone: '+34 600 456 789',
      role: 'nurse',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'nurse2@example.com',
      password: hashedPassword,
      first_name: 'Laura',
      last_name: 'García',
      phone: '+34 600 567 890',
      role: 'nurse',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'nurse3@example.com',
      password: hashedPassword,
      first_name: 'Pedro',
      last_name: 'López',
      phone: '+34 600 678 901',
      role: 'nurse',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'nurse4@example.com',
      password: hashedPassword,
      first_name: 'Carmen',
      last_name: 'Sánchez',
      phone: '+34 600 789 012',
      role: 'nurse',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'nurse5@example.com',
      password: hashedPassword,
      first_name: 'Miguel',
      last_name: 'Fernández',
      phone: '+34 600 890 123',
      role: 'nurse',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'nurse6@example.com',
      password: hashedPassword,
      first_name: 'Elena',
      last_name: 'Ruiz',
      phone: '+34 600 901 234',
      role: 'nurse',
      is_active: true,
      email_verified: true,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    },
    {
      email: 'nurse7@example.com',
      password: hashedPassword,
      first_name: 'David',
      last_name: 'Moreno',
      phone: '+34 600 012 345',
      role: 'nurse',
      is_active: true,
      email_verified: false,
      reset_password_token: null,
      reset_password_expires: null,
      email_verification_token: null,
      email_verification_expires: null,
      last_login: null
    }
  ]);
};
