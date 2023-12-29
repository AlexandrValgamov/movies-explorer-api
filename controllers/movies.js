const Movie = require('../models/Movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
    });
    res
      .status(201)
      .send(movie);
  } catch (error) {
    next(error);
  }
};

const removeMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  try {
    const checkMovie = await Movie
      .findById(movieId)
      .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    if (String(checkMovie.owner) !== userId) throw new ForbiddenError('Нельзя удалять карточки других пользователей');

    const data = await Movie
      .deleteOne(checkMovie)
      .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    res.send({ message: 'Карточка удалена', data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  createMovie,
  removeMovie,
};
