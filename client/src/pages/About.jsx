import React from 'react';
import { Server, Layers, Code, Users } from 'lucide-react';

const About = () => {
    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="animate-blur-in" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-cyan)', opacity: 0 }}>System Architecture</h1>
                <p className="animate-blur-in" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', opacity: 0, animationDelay: '0.2s' }}>
                    A technical deep-dive into the Factify platform design.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <ArchitectureCard
                    delay="0s"
                    icon={Layers}
                    title="Design Patterns"
                    items={[
                        "MVC (Model-View-Controller)",
                        "Factory Pattern (User Instantiation)",
                        "Singleton (DB & AI Services)",
                        "Strategy (Dynamic Analysis)",
                        "Observer (Event Handling)",
                        "Proxy (Security Middleware)"
                    ]}
                />
                <ArchitectureCard
                    delay="0.2s"
                    icon={Server}
                    title="Backend Infrastructure"
                    items={[
                        "Node.js Runtime Environment",
                        "Express REST API",
                        "MongoDB Atlas (Cloud Database)",
                        "JWT Stateless Authentication",
                        "BCrypt Encryption"
                    ]}
                />
                <ArchitectureCard
                    delay="0.4s"
                    icon={Code}
                    title="Frontend Stack"
                    items={[
                        "React.js Single Page Application",
                        "Vite Build Tooling",
                        "Glassmorphism UI System",
                        "Context API State Management",
                        "Responsive Grid Layouts"
                    ]}
                />
            </div>

            {/* Team Section */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 className="text-center animate-blur-in" style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-primary)', opacity: 0, animationDelay: '0.5s' }}>
                    Meet Our Team
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <TeamMemberCard
                        delay="0.6s"
                        name="Habiba Ehab"
                        role="Lead Developer"
                        image="/team/habiba.jpg"
                    />
                    <TeamMemberCard
                        delay="0.7s"
                        name="Omar Fawzy"
                        role="Backend Architect"
                        image="https://ui-avatars.com/api/?name=Omar+Fawzy&background=3b82f6&color=fff&size=150"
                    />
                    <TeamMemberCard
                        delay="0.8s"
                        name="Tarek Essam"
                        role="Frontend Engineer"
                        image="https://ui-avatars.com/api/?name=Tarek+Essam&background=8b5cf6&color=fff&size=150"
                    />
                    <TeamMemberCard
                        delay="0.9s"
                        name="Yasmen Yasser"
                        role="Data Scientist"
                        image="https://ui-avatars.com/api/?name=Yasmen+Yasser&background=ec4899&color=fff&size=150"
                    />
                    <TeamMemberCard
                        delay="1.0s"
                        name="Mostafa Ayman"
                        role="AI Engineer"
                        image="https://ui-avatars.com/api/?name=Mostafa+Ayman&background=10b981&color=fff&size=150"
                    />
                </div>
            </div>

            <div className="card animate-blur-in" style={{ padding: '3rem', display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center', opacity: 0, animationDelay: '1s' }}>
                <Users size={48} color="var(--text-primary)" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Project Mission</h2>
                <p style={{ maxWidth: '700px', lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    Developed as a comprehensive Software Engineering case study, Factify demonstrates the practical application
                    of robust architectural patterns in solving modern information integrity challenges. By decoupling the
                    detection logic (Strategy Pattern) from the core application flow, the system achieves high maintainability
                    and extensibility, suitable for enterprise-grade deployment.
                </p>
            </div>
        </div>
    );
};

const ArchitectureCard = ({ icon: Icon, title, items, delay }) => (
    <div className="card animate-blur-in" style={{ opacity: 0, animationDelay: delay }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px' }}>
                <Icon size={24} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
            {items.map((item, index) => (
                <li key={index} style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>{item}</li>
            ))}
        </ul>
    </div>
);

const TeamMemberCard = ({ name, role, image, delay }) => {
    const divRef = React.useRef(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || !isFocused) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="card animate-blur-in"
            style={{
                padding: '2rem',
                textAlign: 'center',
                opacity: 0, // Initial for animation
                animationDelay: delay,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30, 41, 59, 0.4)', // Ensure base background
            }}
        >
            {/* Spotlight Gradient */}
            <div
                style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: opacity,
                    transition: 'opacity 0.3s',
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.15), transparent 40%)`,
                    zIndex: 0,
                }}
            />
            {/* Spotlight Border Highlight */}
            <div
                style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: opacity,
                    transition: 'opacity 0.3s',
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.4), transparent 40%)`,
                    zIndex: 0,
                    maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
                    maskClip: 'content-box, border-box',
                    maskComposite: 'exclude',
                    WebkitMaskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
                    WebkitMaskClip: 'content-box, border-box',
                    WebkitMaskComposite: 'xor',
                    padding: '1px', // Border width equivalent
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: '2px solid var(--accent-cyan)',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)',
                    transition: 'transform 0.3s ease',
                }}>
                    <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>{role}</p>
            </div>
        </div>
    );
};

export default About;
