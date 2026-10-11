import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Phone, Trash2, Edit, ChevronRight } from 'lucide-react';
import HouseholdModal from '../components/HouseholdModal';

interface Household {
  _id: string;
  houseNumber: string;
  precinct: number;
  notes?: string;
  headOfHousehold?: { fullName: string; phone: string; cccd?: string }; // Đã thêm cccd
  zaloGroupJoined: boolean;
}

// Hàm chuẩn hóa tiếng Việt: Bỏ dấu, chuyển chữ thường, đổi Đ thành d
const removeAccents = (str?: string) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

const Households = () => {
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);

  const fetchHouseholds = async () => {
    try {
      const { data } = await axiosClient.get('/households');
      setHouseholds(data);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const handleDeleteHousehold = async (e: React.MouseEvent, householdId: string, houseNumber: string) => {
    e.preventDefault(); 
    if (window.confirm(`Bạn có chắc chắn muốn xóa hộ "${houseNumber}" không? Toàn bộ nhân khẩu sẽ bị xóa sạch!`)) {
      try {
        await axiosClient.delete(`/households/${householdId}`);
        fetchHouseholds(); 
      } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi xóa.');
      }
    }
  };

  // 2. Logic Lọc dữ liệu thông minh (đã bỏ dấu)
  const filteredHouseholds = households.filter((hh) => {
    const query = removeAccents(searchQuery);
    
    const matchHouseNumber = removeAccents(hh.houseNumber).includes(query);
    const matchHeadName = removeAccents(hh.headOfHousehold?.fullName).includes(query);
    const matchPhone = (hh.headOfHousehold?.phone || '').includes(query);
    const matchCCCD = (hh.headOfHousehold?.cccd || '').includes(query);
    
    return matchHouseNumber || matchHeadName || matchPhone || matchCCCD;
  });

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-pulse text-gray-400 font-medium tracking-wide">Đang tải dữ liệu...</div></div>;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Danh sách Hộ gia đình</h2>
          <p className="text-gray-500 mt-1.5 text-sm font-medium">Quản lý và thao tác dữ liệu Tổ 56 & 57</p>
        </div>
        <button 
          onClick={() => { setEditingHousehold(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all duration-200"
        >
          + Thêm Hộ Mới
        </button>
      </div>

      {/* Grid Danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHouseholds.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-gray-50/50 rounded-3xl border border-gray-100/50">
            <span className="text-gray-500 font-medium">
              {searchQuery ? 'Không tìm thấy dữ liệu phù hợp với từ khóa.' : 'Chưa có dữ liệu. Hãy thêm hộ đầu tiên!'}
            </span>
          </div>
        ) : (
          filteredHouseholds.map((hh) => (
            <Link 
              to={`/households/${hh._id}`} 
              key={hh._id} 
              className="group flex flex-col bg-white p-7 rounded-[2rem] border border-gray-100/80 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${hh.precinct === 56 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    Tổ {hh.precinct}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-3.5 tracking-tight flex items-center gap-2">
                    {hh.houseNumber}
                  </h3>
                </div>
                
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    onClick={(e) => { e.preventDefault(); setEditingHousehold(hh); setIsModalOpen(true); }} 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteHousehold(e, hh._id, hh.houseNumber)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="mt-auto pt-5 border-t border-gray-50 space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Chủ hộ</span>
                  <span className="font-semibold text-gray-900">
                    {hh.headOfHousehold?.fullName || <span className="text-gray-300 font-normal italic">Trống</span>}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Liên hệ</span>
                  {hh.headOfHousehold?.phone ? (
                    <span className="flex items-center gap-1.5 font-medium text-gray-900">
                      <Phone size={14} className="text-gray-400" /> {hh.headOfHousehold.phone}
                    </span>
                  ) : (
                    <span className="text-gray-300 font-normal italic">Trống</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-gray-400 font-medium">Nhóm Zalo</span>
                  {hh.zaloGroupJoined ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đã tham gia
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                      Chưa tham gia
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 -mb-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            </Link>
          ))
        )}
      </div>

      <HouseholdModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingHousehold(null); }} onSuccess={fetchHouseholds} editData={editingHousehold} />
    </div>
  );
};

export default Households;