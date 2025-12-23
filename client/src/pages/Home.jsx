import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Database, Lock, Search, Globe, ChevronRight } from 'lucide-react';

const BlurText = ({ text, delay = 0, className = '', style = {} }) => {
    return (
        <span className={className} style={{ display: 'inline-block', ...style }}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    style={{
                        display: 'inline-block',
                        opacity: 0,
                        animation: `blur-in 0.8s ease-out forwards ${delay + index * 0.05}s`,
                        minWidth: char === ' ' ? '0.3em' : 'auto' // Handle spaces
                    }}
                >
                    {char}
                </span>
            ))}
        </span>
    );
};

const BlurTextWords = ({ text, delay = 0, className = '', style = {} }) => {
    return (
        <span className={className} style={{ ...style }}>
            {text.split(' ').map((word, index) => (
                <span
                    key={index}
                    style={{
                        display: 'inline-block',
                        opacity: 0,
                        animation: `blur-in 1s ease-out forwards ${delay + index * 0.15}s`,
                        marginRight: '0.3em'
                    }}
                >
                    {word}
                </span>
            ))}
        </span>
    );
};

const Home = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
            {/* Hero Section */}
            <section className="flex-center" style={{ minHeight: '90vh', flexDirection: 'column', textAlign: 'center', position: 'relative', padding: '2rem' }}>
                <div className="animate-slide-up">
                    {/* Logo removed as requested */}
                </div>

                <div style={{ marginBottom: '1.5rem', lineHeight: 1.1 }}>
                    <h1
                        className="animate-blur-in"
                        style={{
                            fontSize: '6rem',
                            fontWeight: '800',
                            letterSpacing: '-0.025em',
                            color: '#ffffff',
                            textShadow: '0 0 20px rgba(255,255,255,0.1)',
                            margin: 0,
                            animationDelay: '0.2s',
                            opacity: 0 // Start hidden for animation
                        }}
                    >
                        Factify
                    </h1>
                    <h2
                        className="animate-blur-in"
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: '400',
                            color: 'var(--text-secondary)',
                            marginTop: '0.5rem',
                            animationDelay: '0.8s',
                            opacity: 0 // Start hidden for animation
                        }}
                    >
                        Intelligence Layer
                    </h2>
                </div>

                <div style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                    lineHeight: '1.6'
                }}>
                    <BlurTextWords
                        text="Deployment-ready Deep Learning architecture for real-time fake news detection."
                        delay={1.5}
                    />
                    <br />
                    <BlurTextWords
                        text="Integrating Retrieval-Augmented Generation (RAG) with Multi-modal analysis."
                        delay={2.5}
                    />
                </div>

                <div className="animate-slide-up-delay-2" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '3s' }}>
                    <Link to="/register" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Start Analysis <ChevronRight size={18} />
                    </Link>
                    <Link to="/about" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Methodology
                    </Link>
                </div>
            </section>

            {/* LIVE FEED MARQUEE SECTION */}
            <div className="animate-fade-in" style={{ marginBottom: '5rem', width: '100%', animationDelay: '0.5s' }}>
                <h2 className="text-center" style={{ marginBottom: '2rem', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Live Analysis Streams</h2>

                {/* Row 1 - Left Scroll */}
                <div className="marquee-container" style={{ marginBottom: '2rem' }}>
                    <div className="marquee-content animate-scroll-left">
                        <FakeNewsCards />
                        <FakeNewsCards />
                    </div>
                </div>

                {/* Row 2 - Right Scroll */}
                <div className="marquee-container">
                    <div className="marquee-content animate-scroll-right">
                        <RealNewsCards />
                        <RealNewsCards />
                    </div>
                </div>
            </div>

            {/* Features Grid - Fixed Layout */}
            <section className="container animate-fade-in" style={{ paddingBottom: '6rem', position: 'relative', zIndex: 10 }}>
                <h2 className="text-center" style={{ marginBottom: '4rem', fontSize: '2.5rem', background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Core Capabilities
                </h2>
                {/* Changed to Flexbox for better centering and wrapping */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                    <div style={{ flex: '1 1 300px', maxWidth: '400px', minWidth: '300px' }}>
                        <FeatureCard
                            icon={Cpu}
                            title="Generative AI Engine"
                            desc="Utilizes Large Language Models (LLMs) to understand context, nuance, and semantic inconsistencies in articles."
                        />
                    </div>
                    <div style={{ flex: '1 1 300px', maxWidth: '400px', minWidth: '300px' }}>
                        <FeatureCard
                            icon={Database}
                            title="RAG Architecture"
                            desc="Retrieves real-time evidence from a curated vector database of verified fact-checking repositories."
                        />
                    </div>
                    <div style={{ flex: '1 1 300px', maxWidth: '400px', minWidth: '300px' }}>
                        <FeatureCard
                            icon={Globe}
                            title="Multi-Modal Analysis"
                            desc="Advanced STRATEGIES patterns to process Text, URLs, and Image (OCR) inputs simultaneously."
                        />
                    </div>
                </div>
            </section>

            {/* Methodology / Trust Section */}
            <section style={{ background: 'var(--bg-secondary)', padding: '6rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Engineered for <span style={{ color: 'var(--accent-cyan)' }}>Trust</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                            Factify goes beyond simple keyword matching. By implementing the <strong>Observer Pattern</strong>, every analysis is tracked, logged, and cross-referenced.
                            Our <strong>Strategy Pattern</strong> implementation allows for dynamic switching between detection algorithms, ensuring the specific nature of every input is handled with the optimal model.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <TrustItem icon={Lock} text="Enterprise-grade JWT Authentication" />
                            <TrustItem icon={Search} text="Transparent Confidence Scoring" />
                            <TrustItem icon={ShieldCheck} text="99.9% Uptime Architecture" />
                        </div>
                    </div>
                    <div className="card" style={{ flex: '1 1 400px', background: 'var(--bg-primary)', border: '1px solid var(--accent-cyan)', boxShadow: 'var(--shadow-glow)' }}>
                        <code style={{ display: 'block', padding: '1rem', color: 'var(--accent-cyan)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            &gt; Initializing Factify Core...<br />
                            &gt; Loading RAG Models... [OK]<br />
                            &gt; Connecting to Vector DB... [OK]<br />
                            &gt; User Authentication... [Verified]<br />
                            &gt; System Ready.<br />
                            <br />
                            <span style={{ color: 'var(--text-secondary)' }}>// Ready to analyze incoming data streams</span>
                        </code>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
        <Icon size={40} color="var(--accent-blue)" style={{ marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
    </div>
);

const TrustItem = ({ icon: Icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size={20} color="var(--status-real)" />
        <span style={{ fontSize: '1.1rem' }}>{text}</span>
    </div>
);

// Mock Data Components from Tutorial
const FakeNewsCards = () => (
    <>
        <NewsCard type="fake" text="Breaking: Scientists confirm the moon is actually made of aged gouda cheese." />
        <NewsCard type="fake" text="Local man invents water that isn't wet, selling for $500/bottle." />
        <NewsCard type="fake" text="Study shows eating pizza daily guarantees immortality." />
        <NewsCard type="fake" text="Aliens land in Times Square, ask for directions to the nearest Starbucks." />
        <NewsCard type="fake" text="Government admits birds are just surveillance drones." />
    </>
);

const RealNewsCards = () => (
    <>
        <NewsCard type="real" text="Global temperatures continue to rise, marking the hottest decade on record." />
        <NewsCard type="real" text="Tech giant releases new AI model capable of advanced reasoning." />
        <NewsCard type="real" text="Researchers discover new species of deep-sea coral in the Pacific." />
        <NewsCard type="real" text="Stock markets close higher amidst positive economic data." />
        <NewsCard type="real" text="New renewable energy milestones reached in Europe this quarter." />
    </>
);

const NewsCard = ({ type, text }) => (
    <div className="card" style={{
        width: '300px',
        padding: '1.5rem',
        borderLeft: `4px solid ${type === 'fake' ? 'var(--status-fake)' : 'var(--status-real)'}`,
        background: 'rgba(30, 41, 59, 0.6)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className={`badge ${type === 'fake' ? 'badge-fake' : 'badge-real'}`}>
                {type === 'fake' ? 'FAKE' : 'REAL'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Just now</span>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{text}</p>
    </div>
);

export default Home;
