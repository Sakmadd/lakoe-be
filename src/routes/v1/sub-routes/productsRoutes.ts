import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send('Products routes');
});
export default router;
