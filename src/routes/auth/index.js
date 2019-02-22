import express from 'express';
import HttpError from '../http-error';


const router = express.Router();


// Регистрация
router.post('/register', async (req, res, next) => {
  const { userExists, register } = res.locals.db;
  const { createJwt } = res.locals.jwt;
  const { username, email, password } = req.body

  try {
    // Проверка наличия регистрации юзера
    const isUserExists = await userExists(email);

    // Если юзер с таким мылом регался - ошибка
    if (isUserExists) throw new HttpError(400, 'User registered');

    // Регистрируем юзера
    const user = await register({ username, email, password });

    // Создаем токен
    const token = createJwt(user);

    // Полетели
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
})


// Авторизация по мылу и паролю
router.post('/login', async (req, res, next) => {
  const { userExists, findByEmail } = res.locals.db;
  const { createJwt, checkPassword } = res.locals.jwt;
  const { email, password } = req.body;

  try {
    // Проверка наличия регистрации юзера
    const isUserExists = await userExists(email);

    // Если юзера с таким мылом нет - ошибка
    if (!isUserExists) {
      throw new HttpError(400, 'User email or password is invalid');
    }

    // Тянем юзера
    const user = await findByEmail(email);

    // Проверяем пароль
    const isValidPassword = checkPassword(user, password) ;

    if (!isValidPassword) {
      throw new HttpError(400, 'User email or password is invalid');
    }

    // Очищаем данные
    delete user.password_hash;

    // Создаем токен
    const token = createJwt(user);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
})


/**
 * Проверка валидности токена
 * И обновление в токена
 */ 
router.put('/login', async (req, res, next) => {
  const { findByEmail } = res.locals.db;
  const { createJwt, verifyJwt } = res.locals.jwt;
  const token = req.body.token;
  try {
    if (!token) {
      throw new HttpError(400, 'Bad token');
    }

    // Дешифруем токен
    const decoded = verifyJwt(token);

    // Находим пользователя
    const user = await findByEmail(decoded.email);

    // Очищаем данные
    delete user.password_hash;

    // Создаем токен
    const newToken = createJwt(user);

    res.status(200).json({ token: newToken });
    } catch (error) {
    next(error);
  }
});


export default router;