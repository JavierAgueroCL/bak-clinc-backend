const express = require('express');
const UserController = require('../controllers/userController');
const UserValidator = require('../validators/userValidator');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', 
  authenticateToken,
  authorize('admin', 'doctor'),
  UserValidator.validateQueryParams,
  UserController.getAllUsers
);

router.get('/:id', 
  authenticateToken,
  authorize('admin', 'doctor'),
  UserValidator.validateUserId,
  UserController.getUserById
);

router.post('/', 
  authenticateToken,
  authorize('admin'),
  UserValidator.validateCreateUser,
  UserController.createUser
);

router.put('/:id', 
  authenticateToken,
  authorize('admin'),
  UserValidator.validateUserId,
  UserValidator.validateUpdateUser,
  UserController.updateUser
);

router.delete('/:id', 
  authenticateToken,
  authorize('admin'),
  UserValidator.validateUserId,
  UserController.deleteUser
);

router.patch('/:id/deactivate', 
  authenticateToken,
  authorize('admin'),
  UserValidator.validateUserId,
  UserController.softDeleteUser
);

router.patch('/:id/activate', 
  authenticateToken,
  authorize('admin'),
  UserValidator.validateUserId,
  UserController.activateUser
);

router.patch('/:id/password', 
  authenticateToken,
  authorize('admin'),
  UserValidator.validateUserId,
  UserController.updateUserPassword
);

module.exports = router;