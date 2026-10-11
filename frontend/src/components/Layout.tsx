import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Menu, X, Search, LogOut } from 'lucide-react'; // Thêm LogOut

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Dùng để chuyển hướng
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/households', label: 'Hộ gia đình', icon: Users },
  ];

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      localStorage.removeItem('token'); // Xóa thẻ token
      navigate('/login'); // Đẩy về trang đăng nhập
    }
  };

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Quản Lý Khu Phố</h1>
            <p className="text-sm text-gray-500 font-medium">Tổ 56 & 57</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1.5 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon size={20} />{item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen max-w-full overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-3 sm:px-6 shrink-0 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors shrink-0"><Menu size={24} /></button>
            
            <div className="flex-1 flex items-center bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 max-w-md focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
              <Search size={18} className="text-gray-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Tra cứu số nhà, tên, CCCD..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400 truncate"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
              )}
            </div>
          </div>

          {/* Khu vực User & Logout */}
          <div className="flex items-center gap-3 shrink-0 ml-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">AD</div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet context={{ searchQuery }} />
        </div>
      </main>
    </div>
  );
};

export default Layout;