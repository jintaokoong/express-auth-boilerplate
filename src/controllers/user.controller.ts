import express from 'express';
import { AuthGuard } from '../middlewares/auth-guards';
const router = express.Router();

router.get('/', AuthGuard, (_req, res) => {
  console.log(res.locals.user);
  res.send('GET user route.');
})

export default router;