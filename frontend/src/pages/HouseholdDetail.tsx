import { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, UserPlus, Phone, Trash2, Edit, User, ChevronRight, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';
import ResidentModal from '../components/ResidentModal';
import ResidentDetailModal from '../components/ResidentDetailModal';

interface Resident {
  _id: string;
  fullName: string;
  gender?: string;
  phone?: string;
  occupation?: string;
  relationship: string;
  residencyStatus: string;
  tags: string[];
  dob?: string;
  cccd?: string;
  notes?: string;
}

// Hàm chuẩn hóa tiếng Việt
const removeAccents = (str?: string) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

const HouseholdDetail = () => {
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  
  const { id } = useParams<{ id: string }>(); 
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchResidents = async () => {
    try {
      const { data } = await axiosClient.get(`/residents/household/${id}`);
      setResidents(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu nhân khẩu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, [id]);

  const handleDelete = async (e: React.MouseEvent, residentId: string, residentName: string) => {
    e.stopPropagation(); 
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân khẩu "${residentName}" không?`)) {
      try {
        await axiosClient.delete(`/residents/${residentId}`);
        fetchResidents(); 
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa nhân khẩu.');
      }
    }
  };

  const openAddModal = () => {
    setEditingResident(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, person: Resident) => {
    e.stopPropagation(); 
    setEditingResident(person);
    setIsModalOpen(true);
  };

  const openDetailModal = (person: Resident) => {
    setSelectedResident(person);
    setIsDetailOpen(true);
  };

  const exportToExcel = () => {
  // 1. Chuẩn bị dữ liệu với tiêu đề cột tiếng Việt đẹp mắt
  const dataToExport = filteredResidents.map((person, index) => ({
    'STT': index + 1,
    'Họ và Tên': person.fullName,
    'Giới tính': person.gender || '',
    'Ngày sinh': person.dob ? new Date(person.dob).toLocaleDateString('vi-VN') : '',
    'Số CCCD': person.cccd || '',
    'Nghề nghiệp/Học tập': person.occupation || '',
    'Số điện thoại': person.phone || '',
    'Quan hệ': person.relationship,
    'Tình trạng cư trú': person.residencyStatus,
    'Ghi chú': person.notes || '',
    'Phân loại (Tags)': person.tags ? person.tags.join(', ') : ''
  }));

  // 2. Tạo WorkSheet và WorkBook
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách Nhân khẩu');

  // 3. Tự động chỉnh độ rộng cột cho dễ nhìn
  const wscols = [
    { wch: 5 },  // STT
    { wch: 25 }, // Họ tên
    { wch: 10 }, // Giới tính
    { wch: 15 }, // Ngày sinh
    { wch: 15 }, // CCCD
    { wch: 20 }, // Nghề nghiệp
    { wch: 15 }, // SĐT
    { wch: 15 }, // Quan hệ
    { wch: 15 }, // Tình trạng
    { wch: 25 }, // Ghi chú
    { wch: 20 }  // Tags
  ];
  worksheet['!cols'] = wscols;

  // 4. Xuất file và tải xuống
  XLSX.writeFile(workbook, `Danh_Sach_Nhan_Khau_To_56_57.xlsx`);
};

  // 2. Logic lọc nhân khẩu đã được chuẩn hóa không dấu
  const filteredResidents = residents.filter((person) => {
    const query = removeAccents(searchQuery);
    
    const matchName = removeAccents(person.fullName).includes(query);
    const matchPhone = (person.phone || '').includes(query);
    const matchCCCD = (person.cccd || '').includes(query);
    const matchNotes = removeAccents(person.notes).includes(query);

    return matchName || matchPhone || matchCCCD || matchNotes;
  });

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-pulse text-gray-400 font-medium tracking-wide">Đang tải chi tiết...</div></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/households" 
            className="p-2.5 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 rounded-full transition-all text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chi tiết Hộ</h2>
            <p className="text-gray-500 mt-1 text-sm font-medium">Danh sách nhân khẩu hiện tại</p>
          </div>
        </div>
        <div className="flex gap-3">
      <button 
        onClick={exportToExcel}
        className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2.5 rounded-full font-medium hover:bg-emerald-100 transition-all duration-200 flex items-center gap-2"
      >
        <Download size={18} /> Xuất Excel
      </button>
      
      <button 
        onClick={openAddModal}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all duration-200 flex items-center gap-2"
      >
        <UserPlus size={18} /> Thêm Nhân Khẩu
      </button>
    </div>
      </div>

      {/* Danh sách Nhân khẩu */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {filteredResidents.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400 font-medium">
            {searchQuery ? 'Không tìm thấy nhân khẩu nào khớp với từ khóa.' : 'Hộ này chưa có thông tin nhân khẩu. Hãy thêm người đầu tiên!'}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredResidents.map((person) => (
              <div 
                key={person._id} 
                onClick={() => openDetailModal(person)}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50/60 cursor-pointer transition-colors"
              >
                {/* Khu vực Thông tin chính */}
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100/50">
                    <User size={22} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {person.fullName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${person.relationship.toLowerCase() === 'chủ hộ' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {person.relationship}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        {person.residencyStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khu vực Liên hệ & Hành động */}
                <div className="flex items-center justify-between md:justify-end gap-6 mt-5 md:mt-0 ml-17 md:ml-0">
                  
                  <div className="flex flex-col items-start md:items-end gap-2">
                    {person.phone ? (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Phone size={14} className="text-gray-400" /> {person.phone}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300 italic">Chưa có SĐT</span>
                    )}
                    
                    {person.tags && person.tags.length > 0 && (
                      <div className="flex gap-1.5">
                        {person.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] font-semibold bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                        {person.tags.length > 2 && (
                          <span className="text-[10px] font-semibold bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                            +{person.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={(e) => openEditModal(e, person)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, person._id, person.fullName)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="p-2 text-gray-300 ml-1 hidden md:block">
                      <ChevronRight size={20} />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {id && (
        <ResidentModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingResident(null);
          }} 
          onSuccess={fetchResidents} 
          householdId={id} 
          editData={editingResident} 
        />
      )}

      <ResidentDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        resident={selectedResident}
      />
    </div>
  );
};

export default HouseholdDetail;