const bcrypt = require('bcrypt');
const User = require('../models/User');
const { MONGO_DUPLACATE_ERROR_CODE } = require('../utils/constants');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const generateToken = require('../utils/jwt');

const getUserInfo = async (req, res, next) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id)
      .orFail(new NotFoundError('Пользователь с указанным id не найден'));
    res.send(user);
  } catch (error) {
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
      .orFail(new NotFoundError('Пользователь с указанным id не найден'));
    res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(error);
    }
  }
};

const createUser = async (req, res, next) => {
  const {
    email, password, name,
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
      next(new ConflictError('Такой пользователь уже существует'));
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password')
      .orFail(new UnauthorizedError('Неправильные почта или пароль'));
    const matched = await bcrypt.compare(String(password), user.password);
    if (!matched) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const token = generateToken({ _id: user._id });
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
  login,
};
