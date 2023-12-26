const userRouter = require('express').Router();

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', updateUser); // добавить userDataValidation

module.exports = userRouter;

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me
