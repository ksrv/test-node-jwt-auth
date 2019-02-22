import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import CONFIG from '../config'


/**
 * Создание JWT-токена
 */
function createJwt (user) {
  return jwt.sign(user, CONFIG.SECRET, { expiresIn: CONFIG.TOKEN_EXPIRES })
}


/**
 * Проверка токена
 */
function verifyJwt (token) {
  return jwt.verify(token, CONFIG.SECRET)
}


/**
 * Проверка валидности пароля
 */
function checkPassword ({ password_hash }, password) {
  return bcrypt.compareSync(password, password_hash);
}


export default function (app) {
  app.use( async (req, res, next) => {
    res.locals.jwt = {
      createJwt,
      verifyJwt,
      checkPassword
    };
    next();
  });
};