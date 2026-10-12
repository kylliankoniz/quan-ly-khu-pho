import { X, Phone, Calendar, Clipboard, User, Tag, Heart, Briefcase, FileText } from 'lucide-react';

interface Resident {
  _id: string;
  fullName: string;
  gender?: string;      // Thêm giới tính
  phone?: string;
  dob?: string;
  cccd?: string;
  occupation?: string;  // Thêm nghề nghiệp
  relationship: string;
  residencyStatus: string;
  tags: string[];
  notes?: string; 
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
}

export default function ResidentDetailModal({ isOpen, onClose, resident }: Props) {
  if (!isOpen || !resident) return null;

  const copyToClipboard = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào bộ nhớ tạm!');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Chưa cập nhật';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition p-1.5 hover:bg-gray-100 rounded-full z-10"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-b from-blue-50 to-white pt-8 pb-6 px-6 text-center border-b border-gray-50 shrink-0">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-3 shadow-inner">
            <User size={40} className="stroke-[1.5]" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{resident.fullName}</h3>
            {resident.gender && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                resident.gender === 'Nữ' ? 'bg-pink-50 text-pink-600 border-pink-100' : 
                resident.gender === 'Nam' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {resident.gender}
              </span>
            )}
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              {resident.relationship}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {resident.residencyStatus}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0"><Calendar size={18} /></div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ngày sinh</div>
              <div className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(resident.dob)}</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0"><Heart size={18} /></div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Số CCCD</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-medium text-gray-800">{resident.cccd || 'Chưa cập nhật'}</span>
                {resident.cccd && (
                  <button 
                    onClick={() => copyToClipboard(resident.cccd)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition"
                    title="Sao chép"
                  >
                    <Clipboard size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {resident.occupation && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0"><Briefcase size={18} /></div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Nghề nghiệp / Học tập</div>
                <div className="text-sm font-medium text-gray-800 mt-0.5">{resident.occupation}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0"><Phone size={18} /></div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Số điện thoại</div>
                <div className="text-sm font-medium text-gray-800 mt-0.5">{resident.phone || 'Chưa cập nhật'}</div>
              </div>
              {resident.phone && (
                <a 
                  href={`tel:${resident.phone}`}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition shadow-sm"
                >
                  <Phone size={12} /> Gọi
                </a>
              )}
            </div>
          </div>

          {resident.notes && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0"><FileText size={18} /></div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ghi chú</div>
                <div className="text-sm font-medium text-gray-800 mt-0.5 whitespace-pre-wrap leading-relaxed">
                  {resident.notes}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              <Tag size={12} /> Phân loại & Nhãn
            </div>
            {resident.tags && resident.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {resident.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">Không có nhãn phân loại nào.</span>
            )}
          </div>
        </div>

        <div className="bg-gray-50/50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-600 transition"
          >
            Đóng
          </button>
        </div>
        
      </div>
    </div>
  );
}