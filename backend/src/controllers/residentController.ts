import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Resident from '../models/Resident';
import Household from '../models/Household';

// @desc    Tạo mới một nhân khẩu
// @route   POST /api/residents
export const createResident = async (req: Request, res: Response): Promise<void> => {
  try {
    // Chuyển chuỗi rỗng thành undefined để MongoDB không báo lỗi trùng lặp
    if (req.body.cccd === '') req.body.cccd = undefined;
    if (req.body.phone === '') req.body.phone = undefined;

    const newResident = new Resident(req.body);
    const savedResident = await newResident.save();

    // FIX LỖI Ở ĐÂY: Nếu người vừa tạo là Chủ hộ, cập nhật ngay vào bảng Household
    if (savedResident.relationship && savedResident.relationship.trim().toLowerCase() === 'chủ hộ') {
      await Household.findByIdAndUpdate(savedResident.householdId, {
        headOfHousehold: savedResident._id
      });
    }

    res.status(201).json(savedResident);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo nhân khẩu', error });
  }
};

// @desc    Lấy danh sách nhân khẩu theo ID hộ gia đình
// @route   GET /api/residents/household/:householdId
export const getResidentsByHousehold = async (req: Request, res: Response): Promise<void> => {
  try {
    const { householdId } = req.params;
    const residents = await Resident.find({ householdId });
    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân khẩu' });
  }
};

// @desc    Cập nhật thông tin một nhân khẩu
// @route   PUT /api/residents/:id
export const updateResident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (req.body.cccd === '') req.body.cccd = undefined;
    if (req.body.phone === '') req.body.phone = undefined;

    const updatedResident = await Resident.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedResident) {
      res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
      return;
    }

    // Nếu người này vừa được sửa thành "Chủ hộ", cập nhật lại bảng Hộ gia đình
    if (req.body.relationship && req.body.relationship.trim().toLowerCase() === 'chủ hộ') {
      const household = await Household.findById(updatedResident.householdId);
      if (household) {
        household.headOfHousehold = updatedResident._id as mongoose.Types.ObjectId;
        await household.save();
      }
    }

    res.status(200).json(updatedResident);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật nhân khẩu', error });
  }
};

// @desc    Xóa một nhân khẩu
// @route   DELETE /api/residents/:id
export const deleteResident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedResident = await Resident.findByIdAndDelete(id);
    
    if (!deletedResident) {
      res.status(404).json({ message: 'Không tìm thấy nhân khẩu này' });
      return;
    }

    // Nếu người bị xóa là "Chủ hộ", gỡ ID của họ ra khỏi bảng Household
    if (deletedResident.relationship.trim().toLowerCase() === 'chủ hộ') {
      await Household.findByIdAndUpdate(deletedResident.householdId, {
        $unset: { headOfHousehold: "" }
      });
    }

    res.status(200).json({ message: 'Xóa nhân khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa nhân khẩu' });
  }
};

// Lấy toàn bộ nhân khẩu (Dành cho chức năng Xuất Excel)
export const getAllResidents = async (req: Request, res: Response) => {
  try {
    const residents = await Resident.find();
    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân khẩu', error });
  }
};