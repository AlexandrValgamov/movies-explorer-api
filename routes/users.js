const userRouter = require('express').Router();
const { userDataValidation } = require('../middlewares/validation');
const {
  updateUser,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', userDataValidation, updateUser);

module.exports = userRouter;
