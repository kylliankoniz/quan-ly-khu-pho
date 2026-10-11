import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// 1. API Đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    // Tìm user trong DB
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Tài khoản không tồn tại!' });
      return;
    }

    // So sánh mật khẩu (đã mã hóa)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Mật khẩu không chính xác!' });
      return;
    }

    // Tạo JWT Token có thời hạn 1 ngày
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '1d' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 2. API Khởi tạo tài khoản Admin đầu tiên (Chỉ dùng 1 lần)
export const initAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      res.status(400).json({ message: 'Tài khoản admin đã tồn tại!' });
      return;
    }

    // Mã hóa mật khẩu "123456"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    const newAdmin = new User({ username: 'admin', password: hashedPassword });
    await newAdmin.save();
    
    res.status(201).json({ message: 'Đã tạo tài khoản admin (123456) thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};