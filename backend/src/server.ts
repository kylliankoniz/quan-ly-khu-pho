import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import analyticsRoutes from './routes/analyticsRoutes';
import authRoutes from './routes/authRoutes';

// Import Routes
import householdRoutes from './routes/householdRoutes';
import residentRoutes from './routes/residentRoutes'; 
import searchRoutes from './routes/searchRoutes';

dotenv.config();
console.log("Bắt đầu khởi tạo server...");

connectDB().then(() => {
  console.log("Lệnh gọi kết nối database đã thực thi xong.");
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cắm API routes vào server
app.use('/api/households', householdRoutes);
app.use('/api/residents', residentRoutes); // <-- Thêm dòng này
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Quản lý Khu phố đang chạy! 🚀' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});