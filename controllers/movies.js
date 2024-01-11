const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const movies = await Movie.find({ userId });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: userId,
    });
    res
      .status(201)
      .send(movie);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new BadRequestError(`Ошибка валидации. ${validationErrors.join(' ')}`));
    }
    next(error);
  }
};

const removeMovie = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const checkMovie = await Movie
      .findById(id)
      .orFail();
    if (String(checkMovie.owner) !== userId) throw new ForbiddenError('Нельзя удалять карточки других пользователей');

    const data = await Movie
      .deleteOne(checkMovie)
      .orFail();
    res.send({ message: 'Карточка удалена', data });
  } catch (error) {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Карточка с указанным _id не найдена'));
    }
    next(error);
  }
};

module.exports = {
  getMovies,
  createMovie,
  removeMovie,
};
