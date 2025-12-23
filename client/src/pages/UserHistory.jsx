import { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock } from 'lucide-react';

const UserHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/analyze/history');
                setHistory(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock color="var(--accent-cyan)" /> My Analysis History
            </h2>

            {loading ? (
                <p>Loading history...</p>
            ) : history.length === 0 ? (
                <p>No history found.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Type</th>
                                <th style={{ padding: '1rem' }}>Content Preview</th>
                                <th style={{ padding: '1rem' }}>Result</th>
                                <th style={{ padding: '1rem' }}>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{item.inputType}</td>
                                    <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.inputType === 'url' ? (
                                            <a
                                                href={item.content}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
                                            >
                                                {item.content}
                                            </a>
                                        ) : item.inputType === 'image' ? (
                                            <a
                                                href={`http://localhost:5000/${item.content.replace(/\\/g, '/')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                View Image
                                            </a>
                                        ) : (
                                            item.content
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge ${item.result.classification === 'Fake' ? 'badge-fake' : 'badge-real'}`}>
                                            {item.result.classification}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{Math.round(item.result.confidenceScore)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserHistory;
