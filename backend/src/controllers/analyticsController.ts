import { Request, Response } from 'express';
import Household from '../models/Household';
import Resident from '../models/Resident';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalHouseholds = await Household.countDocuments();
    const households = await Household.find();
    
    const residents = await Resident.find();
    const totalResidents = residents.length;

    const zaloJoined = households.filter(h => h.zaloGroupJoined).length;
    const zaloNotJoined = totalHouseholds - zaloJoined;

    // Thống kê cư trú
    const thuongTru = residents.filter(r => r.residencyStatus === 'Thường trú').length;
    const tamTru = residents.filter(r => r.residencyStatus === 'Tạm trú').length;
    const tamVang = residents.filter(r => r.residencyStatus === 'Tạm vắng').length;

    // Thống kê Giới tính
    const nam = residents.filter(r => r.gender === 'Nam').length;
    const nu = residents.filter(r => r.gender === 'Nữ').length;

    // Thống kê Đoàn viên & Thiếu nhi
    let doanVien = 0;
    let thieuNhi = 0;
    const currentYear = new Date().getFullYear();

    residents.forEach(r => {
      // Đếm Đoàn viên (dựa vào tags)
      if (r.tags && r.tags.some(tag => tag.toLowerCase().includes('đoàn viên'))) {
        doanVien++;
      }
      
      // Đếm Thiếu nhi (dựa vào tags hoặc tự động tính tuổi dưới 16)
      let isThieuNhi = false;
      if (r.tags && r.tags.some(tag => tag.toLowerCase().includes('thiếu nhi'))) {
        isThieuNhi = true;
      } else if (r.dob) {
        const age = currentYear - new Date(r.dob).getFullYear();
        if (age < 16) isThieuNhi = true;
      }
      
      if (isThieuNhi) thieuNhi++;
    });

    res.status(200).json({
      overview: { 
        totalHouseholds, 
        totalResidents, 
        zaloJoined, 
        zaloNotJoined,
        male: nam,
        female: nu,
        doanVien,
        thieuNhi
      },
      residency: [
        { name: 'Thường trú', value: thuongTru },
        { name: 'Tạm trú', value: tamTru },
        { name: 'Tạm vắng', value: tamVang }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};