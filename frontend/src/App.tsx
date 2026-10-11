import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react'; // 1. Thêm dòng này
import Layout from './components/Layout';
import Home from './pages/Home';
import Households from './pages/Households';
import HouseholdDetail from './pages/HouseholdDetail';
import Login from './pages/Login';

// 2. Thay JSX.Element thành ReactNode
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>; // Sử dụng fragment để bọc children cho an toàn
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="households" element={<Households />} />
          <Route path="households/:id" element={<HouseholdDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;