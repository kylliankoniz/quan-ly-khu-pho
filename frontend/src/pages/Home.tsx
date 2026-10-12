import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Users, Home as HomeIcon, Flag, Baby } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface AnalyticsData {
  overview: { 
    totalHouseholds: number; 
    totalResidents: number; 
    zaloJoined: number; 
    zaloNotJoined: number;
    male: number;
    female: number;
    doanVien: number;
    thieuNhi: number;
  };
  residency: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444']; 
const ZALO_COLORS = ['#10b981', '#cbd5e1'];
const GENDER_COLORS = ['#3b82f6', '#ec4899']; // Xanh cho Nam, Hồng cho Nữ

const Home = () => {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosClient.get('/analytics');
        setStats(data);
      } catch (error) {
        console.error('Lỗi tải dữ liệu thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-pulse text-gray-400 font-medium tracking-wide">Đang tải bảng điều khiển...</div></div>;
  if (!stats) return null;

  const zaloData = [
    { name: 'Đã tham gia', value: stats.overview.zaloJoined },
    { name: 'Chưa tham gia', value: stats.overview.zaloNotJoined },
  ];

  const genderData = [
    { name: 'Nam', value: stats.overview.male },
    { name: 'Nữ', value: stats.overview.female },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Trung tâm Chỉ huy</h2>
        <p className="text-gray-500 mt-1.5 text-sm font-medium">Báo cáo số liệu dân cư và phong trào thời gian thực</p>
      </div>

      {/* 4 Thẻ Số liệu Tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100/80 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="text-gray-400 font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-[10px] md:text-xs">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-full shrink-0"><HomeIcon size={16}/></div>
            Tổng số hộ
          </div>
          <div className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{stats.overview.totalHouseholds}</div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100/80 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="text-gray-400 font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-[10px] md:text-xs">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-full shrink-0"><Users size={16}/></div>
            Nhân khẩu
          </div>
          <div className="text-4xl md:text-5xl font-bold text-blue-600 tracking-tight">{stats.overview.totalResidents}</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100/80 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="text-gray-400 font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-[10px] md:text-xs">
            <div className="p-2 bg-purple-50 text-purple-500 rounded-full shrink-0"><Flag size={16}/></div>
            Đoàn viên
          </div>
          <div className="text-4xl md:text-5xl font-bold text-purple-600 tracking-tight">{stats.overview.doanVien}</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100/80 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="text-gray-400 font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-[10px] md:text-xs">
            <div className="p-2 bg-pink-50 text-pink-500 rounded-full shrink-0"><Baby size={16}/></div>
            Thiếu nhi
          </div>
          <div className="text-4xl md:text-5xl font-bold text-pink-600 tracking-tight">{stats.overview.thieuNhi}</div>
        </div>
      </div>

      {/* 3 Biểu đồ chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Biểu đồ Cư trú */}
        <div className="bg-white p-7 rounded-[2rem] border border-gray-100/80 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tình trạng cư trú</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.residency} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value" stroke="none">
                  {stats.residency.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>Thường</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>Tạm</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>Vắng</span>
          </div>
        </div>

        {/* Biểu đồ Giới tính */}
        <div className="bg-white p-7 rounded-[2rem] border border-gray-100/80 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tỷ lệ Nam / Nữ</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value" stroke="none">
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>Nam</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ec4899]"></span>Nữ</span>
          </div>
        </div>

        {/* Biểu đồ Zalo */}
        <div className="bg-white p-7 rounded-[2rem] border border-gray-100/80 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Mạng lưới Zalo</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={zaloData} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value" stroke="none">
                  {zaloData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={ZALO_COLORS[index % ZALO_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span>Đã vào</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#cbd5e1]"></span>Chưa</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;