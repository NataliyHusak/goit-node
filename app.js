const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./users/auth.routes'));


if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.use((req, res, next) => {
	res.status(404).json({ error: 'Endpoint not found' });
	next();
});

app.use((error, req, res, next) => {
	if (process.env.NODE_ENV === 'production') {
		return res.status(500).json({ error: 'Unexpected error: ' + error });
	}
	next(error);
});

const PORT = process.env.PORT || 3002;

async function start() {
	try {
		await mongoose.connect(process.env.mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
	} catch (e) {
		console.log('Server Error', e.message);
		process.exit(1);
	}
}

start();
