const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const MONGO_DUPLACATE_ERROR_CODE = 11000;
const regex = /https?:\/\/(www\.)?[\w-]+\.[a-zA-Z\d._~:?#[\]/@!$&'()*+,;=-]{2,}#?/;

const allowedCors = [
  'https://alexvpraktikum.nomoredomainsmonster.ru',
  'http://localhost:3000',
  'http://localhost:5173',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  FORBIDDEN,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
  MONGO_DUPLACATE_ERROR_CODE,
  regex,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
