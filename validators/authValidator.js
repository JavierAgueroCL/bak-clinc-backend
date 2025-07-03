class AuthValidator {
  static validateRegister(req, res, next) {
    const { email, password, first_name, last_name } = req.body;
    const errors = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email es requerido y debe ser una cadena válida');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email debe tener un formato válido');
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password es requerido y debe ser una cadena válida');
    } else if (password.length < 6) {
      errors.push('Password debe tener al menos 6 caracteres');
    }

    if (!first_name || typeof first_name !== 'string') {
      errors.push('First name es requerido y debe ser una cadena válida');
    } else if (first_name.trim().length < 2) {
      errors.push('First name debe tener al menos 2 caracteres');
    }

    if (!last_name || typeof last_name !== 'string') {
      errors.push('Last name es requerido y debe ser una cadena válida');
    } else if (last_name.trim().length < 2) {
      errors.push('Last name debe tener al menos 2 caracteres');
    }

    if (req.body.role && !['admin', 'doctor', 'patient'].includes(req.body.role)) {
      errors.push('Role debe ser admin, doctor o patient');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }

  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email es requerido y debe ser una cadena válida');
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password es requerido y debe ser una cadena válida');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }

  static validateEmail(req, res, next) {
    const { email } = req.body;
    const errors = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email es requerido y debe ser una cadena válida');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email debe tener un formato válido');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }

  static validateResetPassword(req, res, next) {
    const { token, newPassword } = req.body;
    const errors = [];

    if (!token || typeof token !== 'string') {
      errors.push('Token es requerido y debe ser una cadena válida');
    }

    if (!newPassword || typeof newPassword !== 'string') {
      errors.push('Nueva contraseña es requerida y debe ser una cadena válida');
    } else if (newPassword.length < 6) {
      errors.push('Nueva contraseña debe tener al menos 6 caracteres');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }

  static validateToken(req, res, next) {
    const { token } = req.body;
    const errors = [];

    if (!token || typeof token !== 'string') {
      errors.push('Token es requerido y debe ser una cadena válida');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }
}

module.exports = AuthValidator;