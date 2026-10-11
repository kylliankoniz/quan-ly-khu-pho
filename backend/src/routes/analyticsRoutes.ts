import { Router } from 'express';
import { getDashboardStats } from '../controllers/analyticsController';

const router = Router();
router.get('/', getDashboardStats);

export default router;