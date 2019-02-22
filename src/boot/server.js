import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

export default app => {
  // Логи
  // if (process.env.NODE_ENV === 'development') {
  //   app.use(morgan('combined'));
  // }

  // CORS
  app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));

  // парсинг тела запросов
  app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: false }));
}