import mysql from 'mysql';
import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';

const options = {
  user: 'konstantin',
  password: '1',
  database: 'srvs',
};

const client = mysql.createConnection(options);

client.connect(error => {
  if (error) {
    console.error('Ошибка соединения с БД', error);
    throw error;
  } else {
    console.log('Connected');
  }

});


/**
 * Проверяем наличие пользователя
 */
function userExists (mysql) {
  return function (email) {
    return new Promise((resolve, reject) => {
      mysql.query('SELECT * FROM users WHERE email = ?', email, (error, results, fields) => {
        if (error) return reject(error);
        resolve(!!results.length);
      });
    });
  }
}

/**
 * Регистрация пользователя
 */
function register (mysql) {
  return function ({ username, email, password }) {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const salt = bcrypt.genSaltSync(4);
      const password_hash = bcrypt.hashSync(password, salt);
      const user = { id, username, email, password_hash };

      mysql.query('INSERT INTO users SET ?', user, (error, results, fields) => {
        if (error) return reject(error);
        resolve({ id, username, email });
      });
    });
  }
}


/**
 * Находим пользователя по мылу
 */
function findByEmail (mysql) {
  return function (email) {
    return new Promise((resolve,reject) => {
      mysql.query('SELECT * FROM users WHERE email = ?', email, (error, results, fields) => {
        if (error) return reject(error);
        resolve({ ...results[0] });
      });
    });
  }
}


export default app => {
  app.use( async (req, res, next) => {
    try {
      res.locals.db = {
        userExists: userExists(client),
        register: register(client),
        findByEmail: findByEmail(client),
      };
      next();
    } catch (error) {
      console.log(error);
    }
  });
}