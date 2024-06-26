const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');

const { JWT_SECRET, NODE_ENV } = process.env;
const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new BadRequestError('С токеном что-то не так');
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, NODE_ENV ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Истек срок действия токена'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Ошибка валидации токена'));
    }
    return next(new UnauthorizedError('С токеном что-то не так'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
