import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, ShieldCheck, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Gọi API Đăng nhập thật từ Backend
      const { data } = await axiosClient.post('/auth/login', { username, password });
      
      // Lưu token và quyền (role) vào trình duyệt
      localStorage.setItem('token', data.token); 
      localStorage.setItem('userRole', data.role); // Đã thêm dòng này để lưu quyền
      
      navigate('/'); // Chuyển hướng vào trang chủ
      
    } catch (err: any) {
      // Bắt lỗi (sai pass, không tồn tại...) từ Backend trả về
      setError(err.response?.data?.message || 'Lỗi kết nối đến máy chủ!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans animate-fade-in">
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản Lý Khu Phố</h1>
        <p className="text-gray-500 font-medium mt-1">Đăng nhập để truy cập hệ thống</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-gray-100">
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Tài khoản</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all text-gray-700 font-medium"
                placeholder="Nhập tên tài khoản"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all text-gray-700 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-xl border border-red-100 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white rounded-full py-3.5 font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98] transition-all mt-4 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</>
            ) : (
              'Đăng nhập hệ thống'
            )}
          </button>

        </form>
      </div>
      
      <p className="mt-8 text-gray-400 text-sm font-medium">
        Phiên bản thử nghiệm dành cho Tổ 56 & 57
      </p>
    </div>
  );
};

export default Login;