const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const { MONGO_DUPLACATE_ERROR_CODE } = require('../utils/constants');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const generateToken = require('../utils/jwt');
const ForbiddenError = require('../errors/forbidden-err');

const ValidationErrorHandler = (error, next) => {
  const validationErrors = Object.values(error.errors).map((err) => err.message);
  return next(new BadRequestError(`Ошибка валидации. ${validationErrors.join(' ')}`));
};

const getUserInfo = async (req, res, next) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id)
      .orFail();
    res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Пользователь с указанным id не найден.'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return ValidationErrorHandler(error, next);
    }
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    )
      .orFail();
    res.send(user);
  } catch (error) {
    if (error.code === MONGO_DUPLACATE_ERROR_CODE) {
      return next(new ConflictError('Такой пользователь уже существует'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return ValidationErrorHandler(error, next);
    }
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Пользователь с указанным id не найден.'));
    }
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    res
      .status(201)
      .send({
        name: newUser.name,
        email: newUser.email,
      });
  } catch (error) {
    if (error.code === MONGO_DUPLACATE_ERROR_CODE) {
      return next(new ConflictError('Такой пользователь уже существует'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return ValidationErrorHandler(error, next);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password')
      .orFail();
    const matched = await bcrypt.compare(String(password), user.password);
    if (!matched) {
      throw new ForbiddenError('Неправильные почта или пароль');
    }

    const token = generateToken({ _id: user._id });
    res.send({ token });
  } catch (error) {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new ForbiddenError('Неправильные почта или пароль'));
    }
    next(error);
  }
};

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
  login,
};
