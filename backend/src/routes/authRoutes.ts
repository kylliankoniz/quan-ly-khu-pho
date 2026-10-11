import express from 'express';
import { login, initAdmin } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/init-admin', initAdmin); 

export default router;