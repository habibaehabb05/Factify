import React from 'react';
import { Github, Twitter, Linkedin, Heart, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '3rem 2rem',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: 0 }}>
                {/* Brand Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <img src="/logo.png" alt="Factify Logo" style={{ height: '50px' }} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Advanced AI-powered fake news detection system for the modern web.
                        Verifying truth in the age of misinformation.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/" style={{ color: 'var(--text-secondary)' }}>Home</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/check" style={{ color: 'var(--text-secondary)' }}>Check News</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/tutorial" style={{ color: 'var(--text-secondary)' }}>Tutorial</a></li>
                    </ul>
                </div>

                {/* Contact/Social */}
                <div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Connect</h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="#" style={{ color: 'var(--text-secondary)' }}><Github size={20} /></a>
                        <a href="#" style={{ color: 'var(--text-secondary)' }}><Twitter size={20} /></a>
                        <a href="#" style={{ color: 'var(--text-secondary)' }}><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    &copy; {new Date().getFullYear()} Factify. Made with <Heart size={14} color="var(--accent-cyan)" /> for University Project.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
