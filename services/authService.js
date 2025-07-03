const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

class AuthService {
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.is_active) {
      throw new Error('Cuenta desactivada');
    }

    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    await User.update(user.id, { last_login: new Date() });

    const token = this.generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }

  static async register(userData) {
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      ...userData,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, verificationToken };
  }

  static async requestPasswordReset(email) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const resetToken = this.generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await User.update(user.id, {
      reset_password_token: resetToken,
      reset_password_expires: resetExpires,
    });

    return resetToken;
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findByResetToken(token);
    if (!user) {
      throw new Error('Token inválido o expirado');
    }

    await User.update(user.id, {
      password: await require('bcryptjs').hash(newPassword, 10),
      reset_password_token: null,
      reset_password_expires: null,
    });

    return true;
  }

  static async verifyEmail(token) {
    const user = await User.findByVerificationToken(token);
    if (!user) {
      throw new Error('Token de verificación inválido o expirado');
    }

    await User.update(user.id, {
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
    });

    return true;
  }
}

module.exports = AuthService;