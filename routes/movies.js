const userRouter = require('express').Router();

userRouter.get('/', getMovies);
userRouter.post('/', createMovie);
userRouter.delete('/:_id', removeMovie); // добавить DataValidation

module.exports = userRouter;

// # возвращает все сохранённые текущим пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer, nameRU, nameEN и
// thumbnail, movieId
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
