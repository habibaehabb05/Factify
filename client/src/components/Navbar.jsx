import { useState, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <Link to="/" className="flex-center" style={{ gap: '0.5rem', textDecoration: 'none' }} onClick={closeMenu}>
                <img src="/logo.png" alt="Factify Logo" style={{ height: '40px', objectFit: 'contain' }} />
            </Link>

            <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <NavLink to="/about" onClick={closeMenu}>About</NavLink>
                <NavLink to="/tutorial" onClick={closeMenu}>Tutorial</NavLink>
                <NavLink to="/check" onClick={closeMenu}>Check News</NavLink>

                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <NavLink to="/admin" onClick={closeMenu}>Dashboard</NavLink>
                        ) : (
                            <NavLink to="/history" onClick={closeMenu}>My History</NavLink>
                        )}
                        <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                        <NavLink to="/register" className="btn" onClick={closeMenu} style={{ color: 'white' }}>Get Started</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
