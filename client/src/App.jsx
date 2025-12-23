import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CheckNews from './pages/CheckNews';
import UserHistory from './pages/UserHistory';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Tutorial from './pages/Tutorial';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useRef } from 'react';

function App() {
  const mouseRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mouseRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        mouseRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(29, 78, 216, 0.15), transparent 80%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Router>
      <AuthProvider>
        {/* Liquid Ether Background */}
        <div className="liquid-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        {/* Mouse Follower Background Overlay */}
        <div
          ref={mouseRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: -1, /* Just above the liquid bg but below content */
            transition: 'background 0.1s ease',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1, paddingBottom: '2rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Routes */}
              <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                <Route path="/check" element={<CheckNews />} />
                <Route path="/history" element={<UserHistory />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
