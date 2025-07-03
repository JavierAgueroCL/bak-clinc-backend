const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const { page, limit, role, is_active, search } = req.query;
      
      const filters = { role, is_active, search };
      const pagination = { page, limit };
      
      const result = await User.findAll(filters, pagination);
      
      const usersWithoutPasswords = result.users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json({
        users: usersWithoutPasswords,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByIdExcludingPassword(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { email, password, first_name, last_name, phone, role } = req.body;

      const existingUser = await User.findByEmail(email.toLowerCase().trim());
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const userData = {
        email: email.toLowerCase().trim(),
        password,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        phone: phone ? phone.trim() : null,
        role: role || 'patient'
      };

      const user = await User.create(userData);
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      const userExists = await User.exists(id);
      if (!userExists) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase().trim();
        
        const existingUser = await User.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== parseInt(id)) {
          return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
        }
      }

      if (updateData.first_name) {
        updateData.first_name = updateData.first_name.trim();
      }

      if (updateData.last_name) {
        updateData.last_name = updateData.last_name.trim();
      }

      if (updateData.phone) {
        updateData.phone = updateData.phone.trim();
      }

      delete updateData.password;

      const updatedUser = await User.update(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;

      res.json({
        message: 'Usuario actualizado exitosamente',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
      }

      const userExists = await User.exists(id);
      if (!userExists) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await User.delete(id);

      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async softDeleteUser(req, res) {
    try {
      const { id } = req.params;

      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
      }

      const user = await User.softDelete(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Usuario desactivado exitosamente',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ error: 'Nueva contraseña debe tener al menos 6 caracteres' });
      }

      const userExists = await User.exists(id);
      if (!userExists) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await User.updatePassword(id, newPassword);

      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async activateUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.update(id, { is_active: true });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Usuario activado exitosamente',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;