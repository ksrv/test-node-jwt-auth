import server from './server';
import redis from './redis';
import jwt from './jwt';

export default app => {
  server(app);
  redis(app);
  jwt(app);
}