const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('./auth.model');

const createUser = async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { email, password } = req.body;

		const candidate = await User.findOne({ email });

		if (candidate) {
			return res.status(409).json({ message: 'Email in use' });
		}

		const hashPassword = await bcrypt.hash(password, 12);

		const user = new User({ email, password: hashPassword });

		await user.save();

		res.status(201).json({ message: 'user saved!', user });
	} catch (e) {
		res.status(400).text('Ошибка от Joi или другой валидационной библиотеки');
	}
};

const login = async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { email, password } = req.body;

		const user = User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: 'Ошибка от Joi или другой валидационной библиотеки' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: 'Password error' });
		}

		const token = jwt.sign({ userId: user._id }, process.env.jwtSecret, { expiresIn: '1h' });

		res.json({ token });
	} catch (e) {
		res.status(400).send('Ошибка от Joi или другой валидационной библиотеки');
	}
};

const verifyToken = async (req, res, next) => {
	const authorizationHeader = req.get('Authorization');
	if (!authorizationHeader) {
		return res.status(401).json({ message: 'Not authorized' });
	}
	const token = authorizationHeader.replace('Bearer ', '');
	try {
		const userId = jwt.verify(token, process.env.JWT_SECRET).id;
		const user = await User.findById(userId);
		if (!user || user.token !== token) {
			return res.status(401).json({ message: 'Not authorized' });
		}
		req.user = user;
		next();
	} catch (err) {
		res.status(500).text('что-то пошло не так!');
	}
};

const logout = async (req, res, next) => {
	try {
		const user = req.user;
		await userModel.findByIdAndUpdate(user._id, { token: null });
		res.status(200).json({ message: 'Logout success' });
	} catch (err) {
		res.status(401).text('Not authorized');
	}
};

const getCurrentUser = async (req, res, next) => {
	try {
		const userId = req.user._id;
		const user = await userModel.findById(userId);
		res.status(200).json({ email: user.email });
	} catch (err) {
		res.status(401).text('Not authorized');
	}
};

module.exports = {
	createUser,
	login,
	verifyToken,
	logout,
	getCurrentUser
};
