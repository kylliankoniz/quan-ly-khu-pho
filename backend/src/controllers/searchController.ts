import { Request, Response } from 'express';
import Household from '../models/Household';
import Resident from '../models/Resident';

// @desc    Tìm kiếm tổng hợp Hộ gia đình và Nhân khẩu
// @route   GET /api/search?q=...
export const searchAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    
    // Nếu không có từ khóa, trả về mảng rỗng
    if (!q || typeof q !== 'string' || q.trim() === '') {
      res.status(200).json({ households: [], residents: [] });
      return;
    }

    // Tạo Regex tìm kiếm không phân biệt chữ hoa/thường
    const regex = new RegExp(q.trim(), 'i');

    // 1. Tìm Hộ gia đình theo Số nhà hoặc Ghi chú
    const households = await Household.find({
      $or: [
        { houseNumber: regex },
        { notes: regex }
      ]
    })
      .populate('headOfHousehold', 'fullName phone')
      .limit(5); // Giới hạn 5 kết quả cho nhẹ

    // 2. Tìm Nhân khẩu theo Tên, SĐT hoặc CCCD
    const residents = await Resident.find({
      $or: [
        { fullName: regex },
        { phone: regex },
        { cccd: regex }
      ]
    })
      .populate('householdId', 'houseNumber precinct') // Kéo theo thông tin nhà để biết người này ở đâu
      .limit(10); // Giới hạn 10 kết quả

    res.status(200).json({ households, residents });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi hệ thống khi tìm kiếm', 
      error: (error as Error).message 
    });
  }
};