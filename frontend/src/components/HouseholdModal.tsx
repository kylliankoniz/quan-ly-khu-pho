import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import axiosClient from '../api/axiosClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  editData?: any; // Dữ liệu của hộ đang được chọn để sửa (nếu có)
}

interface FormData {
  houseNumber: string;
  precinct: number;
  notes: string;
  zaloGroupJoined: boolean; 
}

export default function HouseholdModal({ isOpen, onClose, onSuccess, editData }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  // Theo dõi biến editData, nếu có dữ liệu thì điền vào form, nếu không thì xóa trắng
  useEffect(() => {
    if (editData) {
      reset({
        houseNumber: editData.houseNumber,
        precinct: editData.precinct,
        notes: editData.notes || '',
        zaloGroupJoined: editData.zaloGroupJoined || false
      });
    } else {
      reset({ houseNumber: '', precinct: 56, notes: '', zaloGroupJoined: false });
    }
  }, [editData, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    try {
      if (editData) {
        // Nếu có editData -> Gọi API Sửa (PUT)
        await axiosClient.put(`/households/${editData._id}`, { 
          ...data, 
          precinct: Number(data.precinct) 
        });
      } else {
        // Nếu không có editData -> Gọi API Thêm mới (POST)
        await axiosClient.post('/households', { 
          ...data, 
          precinct: Number(data.precinct) 
        });
      }
      
      reset();       
      onSuccess();   
      onClose();     
    } catch (error) {
      console.error(error);
      alert('Lỗi: Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {editData ? 'Chỉnh sửa Hộ Gia Đình' : 'Thêm Hộ Gia Đình Mới'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số nhà <span className="text-red-500">*</span></label>
            <input 
              {...register('houseNumber', { required: 'Vui lòng nhập số nhà' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="VD: 56/12A"
            />
            {errors.houseNumber && <span className="text-red-500 text-xs mt-1">{errors.houseNumber.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tổ dân phố <span className="text-red-500">*</span></label>
            <select 
              {...register('precinct', { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="56">Tổ 56</option>
              <option value="57">Tổ 57</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea 
              {...register('notes')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="zaloGroupJoined"
              {...register('zaloGroupJoined')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="zaloGroupJoined" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Hộ này đã tham gia nhóm Zalo Khu phố
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}