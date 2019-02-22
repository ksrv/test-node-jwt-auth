import mysql from 'mysql';

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
  return function (user) {
    return new Promise((resolve, reject) => {
      mysql.query('INSERT INTO users SET ?', user, (error, results, fields) => {
        if (error) return reject(error);
        resolve(user);
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