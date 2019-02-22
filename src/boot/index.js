import server from './server';
import mysql from './mysql';
import jwt from './jwt';

export default app => {
  server(app);
  mysql(app);
  jwt(app);
}