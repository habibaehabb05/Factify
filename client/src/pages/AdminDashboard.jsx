/**
 * @fileoverview Admin Dashboard Page Component
 * @description This module provides the Admin Dashboard interface for the Factify application.
 * It displays system statistics, charts for analysis distribution, user management, and recent analyses feed.
 * 
 * @module pages/AdminDashboard
 * @requires react
 * @requires ../services/api
 * @requires lucide-react
 * @requires recharts
 */

import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, FileText, AlertOctagon, CheckSquare, Trash2, Eye, EyeOff } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

/**
 * AdminDashboard Component
 * 
 * @component
 * @description Main dashboard for admin users. Provides:
 * - System statistics (total users, analyses, fake/real counts)
 * - Pie chart showing Fake vs Real news distribution
 * - Bar chart showing platform activity
 * - User management table with delete functionality
 * - Table of all analyses with user info and results
 * 
 * @returns {JSX.Element} The Admin Dashboard UI
 */
const AdminDashboard = () => {
    const [stats, setStats] = useState({ userCount: 0, analysisCount: 0, fakeCount: 0, realCount: 0 });
    const [analyses, setAnalyses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'analyses'
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, analysesRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/analyses'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setAnalyses(analysesRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            setDeleteConfirm(null);
            // Refresh stats
            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="card flex-center" style={{ flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
            <Icon size={32} color={color} />
            <h3 style={{ margin: 0, fontSize: '2rem' }}>{value}</h3>
            <span style={{ color: 'var(--text-secondary)' }}>{title}</span>
        </div>
    );

    // Chart Data Preparation
    const pieData = [
        { name: 'Fake News', value: stats.fakeCount },
        { name: 'Real News', value: stats.realCount },
    ];
    const COLORS = ['#f59e0b', '#10b981'];

    const barData = [
        { name: 'Total Users', count: stats.userCount },
        { name: 'Total Analyses', count: stats.analysisCount },
    ];

    const TabButton = ({ tab, label }) => (
        <button
            className={`btn ${activeTab === tab ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab(tab)}
            style={{ minWidth: '120px' }}
        >
            {label}
        </button>
    );

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem', color: 'var(--accent-cyan)' }}>Admin Dashboard</h1>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon={Users} title="Total Users" value={stats.userCount} color="var(--accent-blue)" />
                <StatCard icon={FileText} title="Total Analyses" value={stats.analysisCount} color="var(--text-primary)" />
                <StatCard icon={AlertOctagon} title="Fake Detected" value={stats.fakeCount} color="var(--status-fake)" />
                <StatCard icon={CheckSquare} title="Real Verified" value={stats.realCount} color="var(--status-real)" />
            </div>

            {/* Tab Navigation */}
            <div className="flex-center" style={{ gap: '1rem', marginBottom: '2rem', justifyContent: 'flex-start' }}>
                <TabButton tab="overview" label="Overview" />
                <TabButton tab="users" label="Manage Users" />
                <TabButton tab="analyses" label="All Analyses" />
            </div>

            {/* Overview Tab - Charts */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Pie Chart */}
                    <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="text-center" style={{ marginBottom: '1rem' }}>Detection Distribution</h3>
                        <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="text-center" style={{ marginBottom: '1rem' }}>Platform Activity</h3>
                        <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <>
                    <h2 style={{ marginBottom: '1rem' }}>User Management</h2>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Username</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Role</th>
                                    <th style={{ padding: '1rem' }}>Joined</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{user.username}</td>
                                        <td style={{ padding: '1rem' }}>{user.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-real' : ''}`}
                                                style={{ background: user.role === 'admin' ? 'var(--accent-blue)' : '#64748b' }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {user.role !== 'admin' ? (
                                                deleteConfirm === user._id ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        <button
                                                            className="btn"
                                                            style={{ padding: '0.5rem 1rem', background: 'var(--status-fake)' }}
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            className="btn btn-outline"
                                                            style={{ padding: '0.5rem 1rem' }}
                                                            onClick={() => setDeleteConfirm(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn"
                                                        style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                                                        onClick={() => setDeleteConfirm(user._id)}
                                                    >
                                                        <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                                                        Delete
                                                    </button>
                                                )
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)' }}>Protected</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Analyses Tab */}
            {activeTab === 'analyses' && (
                <>
                    <h2 style={{ marginBottom: '1rem' }}>All Analyses ({analyses.length})</h2>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>User</th>
                                    <th style={{ padding: '1rem' }}>Type</th>
                                    <th style={{ padding: '1rem' }}>Content Preview</th>
                                    <th style={{ padding: '1rem' }}>Result</th>
                                    <th style={{ padding: '1rem' }}>Confidence</th>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyses.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{item.userId?.username || 'Guest'}</td>
                                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{item.inputType}</td>
                                        <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                                            {item.content?.substring(0, 50)}...
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {item.result ? (
                                                <span className={`badge ${item.result.classification === 'Fake' ? 'badge-fake' : 'badge-real'}`}>
                                                    {item.result.classification || 'Unknown'}
                                                </span>
                                            ) : (
                                                <span className="badge" style={{ background: '#64748b' }}>Pending</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {item.result?.confidenceScore ? `${Math.round(item.result.confidenceScore)}%` : '-'}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                            {new Date(item.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
