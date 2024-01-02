const userRouter = require('express').Router();
const {
  getMovies,
  createMovie,
  removeMovie,
} = require('../controllers/movies');
const {
  movieDataValidation,
  idValidation,
} = require('../middlewares/validation');

userRouter.get('/', getMovies);
userRouter.post('/', movieDataValidation, createMovie);
userRouter.delete('/:id', idValidation, removeMovie);

module.exports = userRouter;
