const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, first_name, last_name, phone, role } = req.body;

      const result = await AuthService.register({
        email: email.toLowerCase().trim(),
        password,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        phone: phone ? phone.trim() : null,
        role: role || 'patient'
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: result.user,
        verificationToken: result.verificationToken
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email.toLowerCase().trim(), password);

      res.json({
        message: 'Login exitoso',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const resetToken = await AuthService.requestPasswordReset(email.toLowerCase().trim());

      res.json({
        message: 'Token de recuperación enviado',
        resetToken
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      await AuthService.resetPassword(token, newPassword);

      res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      await AuthService.verifyEmail(token);

      res.json({ message: 'Email verificado exitosamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;