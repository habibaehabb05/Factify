import { useState } from 'react';
import api from '../services/api';
import { Search, Link, Image, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CheckNews = () => {
    const [strategy, setStrategy] = useState('text');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        console.log('[CLIENT DEBUG] Starting analysis request');
        console.log('[CLIENT DEBUG] Strategy:', strategy);
        console.log('[CLIENT DEBUG] Content:', strategy === 'image' ? `File: ${file?.name}` : content.substring(0, 50));

        try {
            let response;
            if (strategy === 'url') {
                if (!/^https?:\/\/.+\..+/.test(content)) {
                    alert('Please enter a valid URL (starting with http:// or https://)');
                    setLoading(false);
                    return;
                }
            }

            if (strategy === 'image') {
                console.log('[CLIENT DEBUG] Preparing FormData for image upload');
                const formData = new FormData();
                formData.append('type', 'image');
                formData.append('image', file);
                console.log('[CLIENT DEBUG] Sending POST /analyze with FormData');
                response = await api.post('/analyze', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                console.log('[CLIENT DEBUG] Sending POST /analyze with JSON payload');
                response = await api.post('/analyze', { type: strategy, content });
            }

            console.log('[CLIENT DEBUG] Analysis response received:', response.data);
            setResult(response.data);
        } catch (error) {
            console.error('[CLIENT ERROR] Analysis failed:', error);
            console.error('[CLIENT ERROR] Error details:', error.response?.data || error.message);
            alert('Analysis failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h1 className="text-center animate-blur-in" style={{ color: 'var(--accent-cyan)', marginBottom: '2rem', opacity: 0 }}>Verify News Authenticity</h1>

            <div className="card animate-blur-in" style={{ opacity: 0 }}>
                {/* Strategy Selection */}
                <div className="flex-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                    <button
                        className={`btn ${strategy === 'text' ? '' : 'btn-outline'}`}
                        onClick={() => setStrategy('text')}
                    >
                        <Search size={18} style={{ marginRight: '0.5rem' }} /> Text
                    </button>
                    <button
                        className={`btn ${strategy === 'url' ? '' : 'btn-outline'}`}
                        onClick={() => setStrategy('url')}
                    >
                        <Link size={18} style={{ marginRight: '0.5rem' }} /> URL
                    </button>
                    <button
                        className={`btn ${strategy === 'image' ? '' : 'btn-outline'}`}
                        onClick={() => setStrategy('image')}
                    >
                        <Image size={18} style={{ marginRight: '0.5rem' }} /> Image
                    </button>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit}>
                    {strategy === 'text' && (
                        <textarea
                            rows="6"
                            placeholder="Paste the article text here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    )}
                    {strategy === 'url' && (
                        <input
                            type="url"
                            placeholder="Enter the article URL..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    )}
                    {strategy === 'image' && (
                        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                                style={{ display: 'block', margin: '0 auto' }}
                            />
                            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Upload a screenshot of the news.</p>
                        </div>
                    )}

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
                        {loading ? <span className="flex-center"><Loader className="animate-spin" size={20} /> Analyzing...</span> : 'Analyze Now'}
                    </button>
                </form>
            </div>

            {/* Result Display */}
            {result && (
                <div className={`card ${result.classification === 'Fake' ? 'border-fake' : 'border-real'} animate-blur-in`} style={{ marginTop: '2rem', borderTop: `4px solid ${result.classification === 'Fake' ? 'var(--status-fake)' : 'var(--status-real)'}`, opacity: 0 }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: result.classification === 'Fake' ? 'var(--status-fake)' : 'var(--status-real)' }}>
                            {result.classification === 'Fake' ? <AlertTriangle /> : <CheckCircle />}
                            {result.classification} News
                        </h2>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Confidence Score</span>
                            <div style={{ width: '80px', height: '80px', position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Score', value: result.confidenceScore / 100 },
                                                { name: 'Remaining', value: 1 - (result.confidenceScore / 100) }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={35}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell fill={result.classification === 'Fake' ? 'var(--status-fake)' : 'var(--status-real)'} />
                                            <Cell fill="rgba(255,255,255,0.1)" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    color: result.classification === 'Fake' ? 'var(--status-fake)' : 'var(--status-real)'
                                }}>
                                    {Math.round(result.confidenceScore)}%
                                </div>
                            </div>
                        </div>
                    </div>
                    <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{result.explanation}</p>

                    {/* Source Citations */}
                    {result.sources && result.sources.length > 0 && (
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Search size={16} />
                                Sources Used for Verification ({result.sources.length})
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {result.sources.map((source, idx) => {
                                    // Extract domain name for display
                                    let displayName = source;
                                    try {
                                        const url = new URL(source);
                                        displayName = url.hostname.replace('www.', '');
                                    } catch (e) {
                                        displayName = source.substring(0, 50);
                                    }
                                    return (
                                        <a
                                            key={idx}
                                            href={source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                color: 'var(--text-primary)',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                                                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                            }}
                                        >
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '6px',
                                                background: 'var(--accent-gradient)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Link size={16} color="white" />
                                            </div>
                                            <div style={{ overflow: 'hidden', flex: 1 }}>
                                                <div style={{ fontWeight: '500', marginBottom: '2px' }}>{displayName}</div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-secondary)',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {source}
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CheckNews;
