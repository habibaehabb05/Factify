import React from 'react';
import { Search, Image, Link, CheckCircle, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

const Tutorial = () => {
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div className="flex-center" style={{ flexDirection: 'column', padding: '4rem 2rem', textAlign: 'center' }}>
                <div className="animate-slide-up">
                    <BookOpen size={64} color="var(--accent-cyan)" style={{ marginBottom: '1.5rem' }} />
                </div>
                <h1 className="animate-blur-in" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)', opacity: 0, animationDelay: '0.2s' }}>
                    How to Use <span style={{ color: 'var(--accent-cyan)' }}>Factify</span>
                </h1>
                <p className="animate-blur-in" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', opacity: 0, animationDelay: '0.4s' }}>
                    Master the art of verification. Learn how to use our multi-modal detection tools to separate fact from fiction.
                </p>
            </div>

            {/* Steps Container */}
            <div className="container" style={{ maxWidth: '1000px' }}>
                <h2 className="text-center" style={{ marginBottom: '3rem', fontSize: '2.5rem', color: 'var(--accent-cyan)' }}>Step-by-Step Guide</h2>

                <StepCard
                    delay="0s"
                    number="01"
                    title="Choose Your Strategy"
                    desc="Factify supports Multi-Modal Input strategies. Select the icon matching your data source."
                    icon={
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}><Search size={16} /> Text</div>
                            <div className="btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}><Link size={16} /> URL</div>
                            <div className="btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}><Image size={16} /> Image</div>
                        </div>
                    }
                />

                <div style={{ height: '50px', borderLeft: '2px dashed var(--text-secondary)', margin: '0 3rem', opacity: 0.3 }}></div>

                <StepCard
                    delay="0.3s"
                    number="02"
                    title="Input & Analyze"
                    desc="Paste the article text, enter the URL, or upload a screenshot. Our input sanitization engine cleans the data before sending it to the RAG core."
                    icon={
                        <div style={{
                            width: 'auto',  // Changed from 100% to auto to respect parent padding naturally
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            height: '50px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 1rem',
                            color: 'var(--text-secondary)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontFamily: 'monospace'
                        }}>
                            <span style={{ color: 'var(--accent-cyan)', marginRight: '0.5rem', flexShrink: 0 }}>GET</span>
                            <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 0 }}>
                                https://example-news.com/article/breaking-news-scientists-discover-new-planet
                            </span>
                        </div>
                    }
                />

                <div style={{ height: '50px', borderLeft: '2px dashed var(--text-secondary)', margin: '0 3rem', opacity: 0.3 }}></div>

                <StepCard
                    delay="0.6s"
                    number="03"
                    title="Review Results"
                    desc="Receive an instant classification with a confidence score. The AI Explainer provides cited context for the result."
                    icon={
                        <div className="badge badge-fake" style={{ fontSize: '1rem' }}>
                            <AlertTriangle size={16} /> 98% Fake Detected
                        </div>
                    }
                />
            </div>
        </div>
    );
};

const StepCard = ({ number, title, desc, icon, delay }) => (
    <div className="card animate-blur-in" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', border: '1px solid rgba(6, 182, 212, 0.2)', opacity: 0, animationDelay: delay }}>
        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}>{number}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{desc}</p>
            {icon && <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', maxWidth: '100%', boxSizing: 'border-box' }}>{icon}</div>}
        </div>
    </div>
);

export default Tutorial;
