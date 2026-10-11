import { Request, Response } from 'express';
import Household from '../models/Household';
import Resident from '../models/Resident';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Tổng số hộ & Số hộ tham gia Zalo
    const totalHouseholds = await Household.countDocuments();
    const zaloJoined = await Household.countDocuments({ zaloGroupJoined: true });

    // 2. Thống kê tình trạng cư trú
    const totalResidents = await Resident.countDocuments();
    const thuongTru = await Resident.countDocuments({ residencyStatus: 'Thường trú' });
    const tamTru = await Resident.countDocuments({ residencyStatus: 'Tạm trú' });
    const tamVang = await Resident.countDocuments({ residencyStatus: 'Tạm vắng' });

    // Trả về một object tổng hợp để vẽ biểu đồ
    res.status(200).json({
      overview: {
        totalHouseholds,
        totalResidents,
        zaloJoined,
        zaloNotJoined: totalHouseholds - zaloJoined,
      },
      residency: [
        { name: 'Thường trú', value: thuongTru },
        { name: 'Tạm trú', value: tamTru },
        { name: 'Tạm vắng', value: tamVang }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu thống kê' });
  }
};