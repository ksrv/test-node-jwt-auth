import express from 'express'
import schemas from './schemas';

const router = express.Router()


router.get('/schema/:slug', async (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${ 3600 }`);
  try {
    const slug = req.params.slug
    const schema = schemas[slug];
    if (!schema) throw 'bad slug';
    res.status(200).json(schema);
  } catch (error) {
    console.log('register error', error)
    res.status(500).json(error)
  }
});


router.get('/', async (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${ 3600 }`);
  try {
    const { session } = res.locals;
    const manager = new FormManager(session);
    const forms = await manager.getForms();
    res.status(200).json(forms)
  } catch (error) {
    console.log('register error', error)
    res.status(500).json(error)
  }
})

export default router