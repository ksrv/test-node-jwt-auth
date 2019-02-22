import express from 'express'
import auth from './auth'
// import form from './form'

const router = express.Router();

router.use('/', auth)
// router.use('/form', form);


router.use((error, req, res, next) => {
  if (res.locals.isDevelopment) {
    console.log('register error', error)
  }
  let code, message;
  if (error.name == 'JsonWebTokenError') {
    code = 400;
    message = 'Bad token';
  } else {
    code = error.code || 500;
    message = error.message || 'Server error';
  }
  res.status(code).json({ message });
});

export default router;