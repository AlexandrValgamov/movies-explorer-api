require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { signupValidation, signinValidation } = require('./middlewares/validation');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const exceptionHandler = require('./middlewares/exceptionHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsHandler = require('./middlewares/cors');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(corsHandler);

app.post('/signup', signupValidation, createUser);
app.post('/signin', signinValidation, login);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(exceptionHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
