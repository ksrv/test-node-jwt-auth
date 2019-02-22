import redis from 'redis';
import bcrypt from 'bcrypt';
import config from '../config';
import uuid from 'uuid/v4';

function exitHandler({ cleanup, exit, client }, exitCode) {
  if (cleanup) {
    console.log('clean');
  }
  if (exitCode || exitCode === 0) {
    console.log(`Exit with code: ${ exitCode }`);
  }
  if (exit) {
    client.quit( () => process.exit() )
  }
}


function userExists (redis) {
  return function (email) {
    return new Promise((resolve, reject) => {
      redis.hexists(config.SECRET, email, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}

/**
 * Регистрация пользователя
 */
function register (redis) {
  return function ({ username, email, password }) {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const salt = bcrypt.genSaltSync(4);
      const password_hash = bcrypt.hashSync(password, salt);
      const user = JSON.stringify({ id, username, email, password_hash });
      redis.hset(config.SECRET, email, user, (error, result) => {
        if (error) return reject(error);
        resolve({ id, username, email });
      });
    });
  }
}


/**
 * Находим пользователя по мылу
 */
function findByEmail (redis) {
  return function (email) {
    return new Promise((resolve,reject) => {
      redis.hget(config.SECRET, email, (error, result) => {
        if (error) return reject(error);
        resolve(JSON.parse(result));
      })
    });
  }
}

const client = redis.createClient();

//do something when app is closing
process.on('exit', exitHandler.bind(null,{ cleanup: true, client }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true, client }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true, client }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true, client }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true, client }));


client.on('error', error => {
  console.error('ERROR', error);
});

client.on('connect', () => {
  console.log('Connected');
});

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