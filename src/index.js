import express from 'express';
import boot from './boot';
import routes from './routes';

/**
 * Создаем сервер
 */
const app = express();
const port = process.env.PORT || '3000';
const host = process.env.HOST || '127.0.0.1';

/**
 * Конфигурируем сервер и остальное окружение
 */
boot(app);

/**
 * Загружаем маршруты
 */
app.use(routes);

/**
 * Запускаем сервер
 */
app.listen(port, host, function () {
  console.log(`Server run on ${host}:${port}`);
});
