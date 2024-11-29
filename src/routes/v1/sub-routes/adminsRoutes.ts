import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send('Admins routes');
});
export default router;
