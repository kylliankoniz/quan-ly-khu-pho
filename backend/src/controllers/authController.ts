import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// 1. API Đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Tài khoản không tồn tại!' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Mật khẩu không chính xác!' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '1d' }
    );

    // Gửi kèm role về cho Frontend
    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 2. API Khởi tạo tài khoản
export const initAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    // Cập nhật Admin cũ (nếu có) thành role: admin, hoặc tạo mới nếu chưa có
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await new User({ username: 'admin', password: hashedPassword, role: 'admin' }).save();
    } else {
      await User.updateOne({ username: 'admin' }, { role: 'admin' });
    }

    // Tạo viewer 1
    const viewer1Exists = await User.findOne({ username: 'viewer1' });
    if (!viewer1Exists) {
      await new User({ username: 'viewer1', password: hashedPassword, role: 'viewer' }).save();
    }

    // Tạo viewer 2
    const viewer2Exists = await User.findOne({ username: 'viewer2' });
    if (!viewer2Exists) {
      await new User({ username: 'viewer2', password: hashedPassword, role: 'viewer' }).save();
    }
    
    res.status(200).json({ message: 'Đã hoàn tất tạo tài khoản admin, viewer1, viewer2. (Mật khẩu: 123456)' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};