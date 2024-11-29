import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send('Orders routes');
});
export default router;
