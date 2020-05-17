const { Router } = require('express');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');
const userController = require('./auth.controllers');
const router = Router();

router.post(
	'/register',
	[
		check('email', 'Некорректный емейл').isEmail(),
		check('password', 'минимальная длинна пароля 6 символов').isLength({ min: 6 })
	],
	userController.createUser
);

router.post(
	'/login',
	[
		check('email', 'Некорректный емейл').isEmail(),
		check('password', 'минимальная длинна пароля 6 символов').isLength({ min: 6 })
	],
	userController.login
);

router.post('/logout', userController.verifyToken, userController.logout);
router.get('/current', userController.verifyToken, userController.getCurrentUser);

module.exports = router;
