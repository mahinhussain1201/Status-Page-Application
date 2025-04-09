import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const socket = io('https://status-page-application-1-fy4x.onrender.com');

        const fetchData = async () => {
            try {
                const [servicesRes, incidentsRes] = await Promise.all([
                    axios.get('https://status-page-application-1-fy4x.onrender.com/api/services'),
                    axios.get('https://status-page-application-1-fy4x.onrender.com/api/incidents')
                ]);

                setServices(servicesRes.data);
                setIncidents(incidentsRes.data);
            } catch (error) {
                setError('Failed to fetch data');
            }
        };

        fetchData();

        socket.on('serviceUpdate', () => fetchData());
        socket.on('incidentUpdate', () => fetchData());

        return () => socket.disconnect();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Operational':
                return 'bg-green-100 text-green-800';
            case 'Degraded Performance':
                return 'bg-yellow-100 text-yellow-800';
            case 'Partial Outage':
                return 'bg-orange-100 text-orange-800';
            case 'Major Outage':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getIncidentStatusColor = (status) => {
        switch (status) {
            case 'Investigating':
                return 'bg-yellow-100 text-yellow-800';
            case 'Identified':
                return 'bg-blue-100 text-blue-800';
            case 'Monitoring':
                return 'bg-purple-100 text-purple-800';
            case 'Resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar/>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="container">
                    <div className="card">
                        <h2 className="card-title" style={{color:'#6366f1'}}>System Status</h2>
                        {error && <div className="error-message">{error}</div>}

                        <div className="mt-6">
                            <h3 className="section-title">Services</h3>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                                {services.map(service => (
                                    <div key={service._id} className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6"style={{
                                                boxShadow: '0 1px 3px #6366f1',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                                padding: '1.25rem'
                                            }}>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {service.name}
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                <span className={`status-badge ${getStatusColor(service.status)}`}>
                                                    {service.status}
                                                </span>
                                            </dd>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="section-title" style={{marginTop:'15px'}}>Active Incidents</h3>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                                {incidents.filter(incident => incident.status !== 'Resolved').map(incident => (
                                    <div key={incident._id} className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6" style={{
                                                    boxShadow: '0 1px 3px #6366f1',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                    padding: '1.25rem'
                                                }}>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {incident.title}
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                <span className={`status-badge ${getIncidentStatusColor(incident.status)}`}>
                                                    {incident.status}
                                                </span>
                                            </dd>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg mb-6">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900" style={{marginTop:'15px'}}>Quick Actions</h3>
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3" style={{marginBottom:'80px'}}>
                                    <Link
                                        to="/dashboard/services"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        style={{
                                            backgroundColor: '#6366f1',
                                            color: 'white',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease-in-out',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        Manage Services
                                    </Link>
                                    <Link
                                        to="/dashboard/incidents"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        style={{
                                            backgroundColor: '#6366f1',
                                            color: 'white',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease-in-out',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        Manage Incidents
                                    </Link>
                                    <Link
                                        to="/dashboard/teams"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        style={{
                                            backgroundColor: '#6366f1',
                                            color: 'white',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease-in-out',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        Manage Teams
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
        
    );
};

export default Dashboard;
