class UserValidator {
  static validateCreateUser(req, res, next) {
    const { email, password, first_name, last_name, role } = req.body;
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

    if (role && !['admin', 'doctor', 'patient'].includes(role)) {
      errors.push('Role debe ser admin, doctor o patient');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }

  static validateUpdateUser(req, res, next) {
    const { email, first_name, last_name, role, is_active } = req.body;
    const errors = [];

    if (email !== undefined) {
      if (typeof email !== 'string') {
        errors.push('Email debe ser una cadena válida');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email debe tener un formato válido');
      }
    }

    if (first_name !== undefined) {
      if (typeof first_name !== 'string') {
        errors.push('First name debe ser una cadena válida');
      } else if (first_name.trim().length < 2) {
        errors.push('First name debe tener al menos 2 caracteres');
      }
    }

    if (last_name !== undefined) {
      if (typeof last_name !== 'string') {
        errors.push('Last name debe ser una cadena válida');
      } else if (last_name.trim().length < 2) {
        errors.push('Last name debe tener al menos 2 caracteres');
      }
    }

    if (role !== undefined && !['admin', 'doctor', 'patient'].includes(role)) {
      errors.push('Role debe ser admin, doctor o patient');
    }

    if (is_active !== undefined && typeof is_active !== 'boolean') {
      errors.push('is_active debe ser un valor booleano');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }

  static validateUserId(req, res, next) {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    req.params.id = parseInt(id);
    next();
  }

  static validateQueryParams(req, res, next) {
    const { page, limit, role, is_active, search } = req.query;
    const errors = [];

    if (page !== undefined) {
      const pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        errors.push('Page debe ser un número mayor a 0');
      } else {
        req.query.page = pageNum;
      }
    }

    if (limit !== undefined) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        errors.push('Limit debe ser un número entre 1 y 100');
      } else {
        req.query.limit = limitNum;
      }
    }

    if (role !== undefined && !['admin', 'doctor', 'patient'].includes(role)) {
      errors.push('Role debe ser admin, doctor o patient');
    }

    if (is_active !== undefined && !['true', 'false'].includes(is_active)) {
      errors.push('is_active debe ser true o false');
    } else if (is_active !== undefined) {
      req.query.is_active = is_active === 'true';
    }

    if (search !== undefined && typeof search !== 'string') {
      errors.push('Search debe ser una cadena válida');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  }
}

module.exports = UserValidator;