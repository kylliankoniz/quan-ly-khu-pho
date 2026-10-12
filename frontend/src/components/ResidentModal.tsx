import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import axiosClient from '../api/axiosClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  householdId: string;
  editData?: any; 
}

interface FormData {
  fullName: string;
  gender: string;      // Thêm giới tính
  phone: string;
  dob: string;
  cccd: string;
  occupation: string;  // Thêm nghề nghiệp
  relationship: string;
  residencyStatus: string;
  tags: string; 
  notes: string;
}

export default function ResidentModal({ isOpen, onClose, onSuccess, householdId, editData }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  useEffect(() => {
    if (editData) {
      reset({
        fullName: editData.fullName,
        gender: editData.gender || 'Nam',
        phone: editData.phone || '',
        dob: editData.dob ? editData.dob.substring(0, 10) : '', 
        cccd: editData.cccd || '',
        occupation: editData.occupation || '',
        relationship: editData.relationship,
        residencyStatus: editData.residencyStatus,
        tags: editData.tags ? editData.tags.join(', ') : '',
        notes: editData.notes || '' 
      });
    } else {
      reset({
        fullName: '', gender: 'Nam', phone: '', dob: '', cccd: '', occupation: '',
        relationship: 'Chủ hộ', residencyStatus: 'Thường trú', tags: '', notes: ''
      });
    }
  }, [editData, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    try {
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      const payload = { ...data, householdId, tags: tagsArray };

      if (editData) {
        await axiosClient.put(`/residents/${editData._id}`, payload);
      } else {
        await axiosClient.post('/residents', payload);
      }
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Lỗi: Vui lòng kiểm tra lại thông tin (có thể trùng số CCCD).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition p-1 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {editData ? 'Chỉnh sửa Thông tin Nhân khẩu' : 'Thêm Nhân Khẩu Mới'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Cột 1: Thông tin cá nhân cơ bản */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
                <input {...register('fullName', { required: 'Vui lòng nhập họ tên' })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ví dụ: Nguyễn Văn A" />
                {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName.message}</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select {...register('gender')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input type="date" {...register('dob')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD</label>
                <input {...register('cccd')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Để trống nếu chưa có" />
              </div>
            </div>

            {/* Cột 2: Cư trú & Liên hệ */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quan hệ với chủ hộ <span className="text-red-500">*</span></label>
                  <select {...register('relationship')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Chủ hộ">Chủ hộ</option>
                    <option value="Vợ/Chồng">Vợ/Chồng</option>
                    <option value="Con">Con</option>
                    <option value="Cháu">Cháu</option>
                    <option value="Cha/Mẹ">Cha/Mẹ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng cư trú <span className="text-red-500">*</span></label>
                  <select {...register('residencyStatus')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Thường trú">Thường trú</option>
                    <option value="Tạm trú">Tạm trú</option>
                    <option value="Tạm vắng">Tạm vắng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp / Nơi học tập</label>
                <input {...register('occupation')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Sinh viên ĐH Hùng Vương..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input {...register('phone')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Liên hệ khi cần" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Thẻ phân loại (Tags) - Dùng để lọc nhanh danh sách</label>
            <input {...register('tags')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cách nhau bằng dấu phẩy (VD: Đoàn viên, Dân quân, Sinh viên)" />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
            <textarea 
              {...register('notes')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              rows={2}
              placeholder="Ghi chú về hoàn cảnh, thời gian sinh hoạt, v.v..." 
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Hủy</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {isSubmitting ? 'Đang lưu...' : 'Lưu nhân khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}