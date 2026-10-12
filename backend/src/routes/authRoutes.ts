import express from 'express';
import { login, initAdmin } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.get('/init-admin', initAdmin); // Đổi từ router.post thành router.get

export default router;