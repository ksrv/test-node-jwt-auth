import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;


export default app => {

  app.use((req, res, next) => {
    res.locals.isDevelopment = isDevelopment;
    res.locals.isProduction = isProduction;
    next();
  });

  // Логи
  if (isDevelopment) {
    app.use(morgan('combined'));
  }

  // CORS
  app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));

  // парсинг тела запросов
  app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: false }));
}