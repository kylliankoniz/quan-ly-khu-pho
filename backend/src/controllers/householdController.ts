import { Request, Response } from 'express';
import Household from '../models/Household';
import Resident from '../models/Resident';

// @desc    Tạo mới một Hộ Gia Đình
// @route   POST /api/households
// @access  Private (Sau này sẽ thêm tính năng bảo mật)
export const createHousehold = async (req: Request, res: Response) => {
  try {
    const { houseNumber, precinct, notes } = req.body;

    // Kiểm tra xem số nhà trong tổ này đã tồn tại chưa
    const householdExists = await Household.findOne({ houseNumber, precinct });
    if (householdExists) {
      res.status(400).json({ message: 'Hộ gia đình này đã tồn tại trong hệ thống' });
      return;
    }

    const household = await Household.create({
      houseNumber,
      precinct,
      notes
    });

    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi server khi tạo hộ gia đình',
      error: (error as Error).message 
    });
  }
};

// @desc    Lấy danh sách tất cả Hộ Gia Đình (kèm thông tin Chủ hộ nếu có)
// @route   GET /api/households
// @access  Private
export const getHouseholds = async (req: Request, res: Response) => {
  try {
    const households = await Household.find().populate('headOfHousehold', 'fullName phone');
    res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu' });
  }
};

// @desc    Xóa một Hộ gia đình (và tất cả nhân khẩu bên trong)
// @route   DELETE /api/households/:id
export const deleteHousehold = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 1. Tìm và xóa hộ gia đình
    const deletedHousehold = await Household.findByIdAndDelete(id);
    
    if (!deletedHousehold) {
      res.status(404).json({ message: 'Không tìm thấy hộ gia đình này' });
      return;
    }

    // 2. Xóa tất cả nhân khẩu có chung householdId
    await Resident.deleteMany({ householdId: id });

    res.status(200).json({ message: 'Xóa hộ gia đình và nhân khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa hộ gia đình' });
  }
};
// @desc    Cập nhật thông tin Hộ gia đình
// @route   PUT /api/households/:id
export const updateHousehold = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Cập nhật và trả về dữ liệu mới nhất (new: true)
    const updatedHousehold = await Household.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedHousehold) {
      res.status(404).json({ message: 'Không tìm thấy hộ gia đình này' });
      return;
    }

    res.status(200).json(updatedHousehold);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật hộ gia đình' });
  }
};