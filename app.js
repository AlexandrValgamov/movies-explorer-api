const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const { signupValidation, signinValidation } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');
const exceptionHandler = require('./middlewares/exceptionHandler');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());

app.post('/signup', signupValidation, createUser);
app.post('/signin', signinValidation, login);

app.use(router);

app.use(errors());
app.use(exceptionHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
