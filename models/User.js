const knex = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static get tableName() {
    return 'users';
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await knex(this.tableName)
      .insert({
        ...userData,
        password: hashedPassword,
      })
      .returning('*');
    return user;
  }

  static async findById(id) {
    return await knex(this.tableName)
      .where({ id })
      .first();
  }

  static async findByEmail(email) {
    return await knex(this.tableName)
      .where({ email })
      .first();
  }

  static async update(id, userData) {
    const [user] = await knex(this.tableName)
      .where({ id })
      .update({
        ...userData,
        updated_at: new Date(),
      })
      .returning('*');
    return user;
  }

  static async delete(id) {
    return await knex(this.tableName)
      .where({ id })
      .del();
  }

  static async findByResetToken(token) {
    return await knex(this.tableName)
      .where({ reset_password_token: token })
      .andWhere('reset_password_expires', '>', new Date())
      .first();
  }

  static async findByVerificationToken(token) {
    return await knex(this.tableName)
      .where({ email_verification_token: token })
      .andWhere('email_verification_expires', '>', new Date())
      .first();
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const { role, is_active, search } = filters;
    
    let baseQuery = knex(this.tableName);

    if (role) {
      baseQuery = baseQuery.where('role', role);
    }

    if (is_active !== undefined) {
      baseQuery = baseQuery.where('is_active', is_active);
    }

    if (search) {
      baseQuery = baseQuery.where(function() {
        this.whereILike('first_name', `%${search}%`)
          .orWhereILike('last_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`);
      });
    }

    const total = await baseQuery.clone().count('id as count').first();
    const totalCount = parseInt(total.count);
    
    const offset = (page - 1) * limit;
    const users = await baseQuery
      .clone()
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    };
  }

  static async softDelete(id) {
    const [user] = await knex(this.tableName)
      .where({ id })
      .update({
        is_active: false,
        updated_at: new Date(),
      })
      .returning('*');
    return user;
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [user] = await knex(this.tableName)
      .where({ id })
      .update({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .returning('*');
    return user;
  }

  static async findByIdExcludingPassword(id) {
    return await knex(this.tableName)
      .select(['id', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_active', 'email_verified', 'last_login', 'created_at', 'updated_at'])
      .where({ id })
      .first();
  }

  static async exists(id) {
    const user = await knex(this.tableName)
      .select('id')
      .where({ id })
      .first();
    return !!user;
  }
}

module.exports = User;