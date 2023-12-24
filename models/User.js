const mongoose = require('mongoose');
const validator = require('validator');

// Поля схемы user:
// email — почта пользователя, по которой он регистрируется.
// Это обязательное поле, уникальное для каждого пользователя.
// Также оно должно валидироваться на соответствие схеме электронной почты.

// password — **хеш пароля. Обязательное поле-строка.
// Нужно задать поведение по умолчанию, чтобы база данных не возвращала это поле.
// name — имя пользователя, например: Александр или Мария. Это обязательное
// поле-строка от 2 до 30 символов.

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный Email',
      },
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
    name: {
      type: String,
      default: 'Жак',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
