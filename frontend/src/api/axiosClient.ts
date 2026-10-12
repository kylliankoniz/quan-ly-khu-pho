import axios from 'axios';

const axiosClient = axios.create({
  // Thay đường link bên dưới bằng link thật mà Render vừa cấp cho bạn
  // Ví dụ: 'https://quanlykhupho-api.onrender.com/api'
  baseURL: 'LINK_RENDER_CUA_BAN/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;