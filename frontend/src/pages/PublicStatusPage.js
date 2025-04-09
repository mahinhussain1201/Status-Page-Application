import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const PublicStatusPage = () => {
    const { orgSlug } = useParams();
    const [services, setServices] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const socket = io('https://status-page-application-1-fy4x.onrender.com');
        fetchData();

        socket.on('serviceUpdate', () => fetchData());
        socket.on('incidentUpdate', () => fetchData());

        return () => socket.disconnect();
    }, [orgSlug]);

    const fetchData = async () => {
        try {
            const [servicesRes, incidentsRes] = await Promise.all([
                axios.get(`https://status-page-application-1-fy4x.onrender.com/api/services/public/${orgSlug}`),
                axios.get(`https://status-page-application-1-fy4x.onrender.com/api/incidents/public/${orgSlug}`)
            ]);
            setServices(servicesRes.data);
            setIncidents(incidentsRes.data);
        } catch (error) {
            setError('Failed to fetch status data');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Operational':
                return 'status-badge-success';
            case 'Degraded Performance':
            case 'Partial Outage':
                return 'status-badge-warning';
            case 'Major Outage':
                return 'status-badge-danger';
            default:
                return 'status-badge';
        }
    };

    return (
        <div className="status-container">
            <div className="status-card mb-6">
                <h1 className="status-card-title">System Status</h1>
                <div className="status-grid">
                    {services.map(service => (
                        <div key={service._id} className="status-card">
                            <div className="status-flex justify-between items-center">
                                <h3 className="status-text-lg font-medium">{service.name}</h3>
                                <span className={getStatusBadgeClass(service.status)}>
                                    {service.status}
                                </span>
                            </div>
                            {service.description && (
                                <p className="status-text-sm text-gray-500 mb-4">{service.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {incidents.length > 0 && (
                <div className="status-card">
                    <h2 className="status-card-title">Active Incidents</h2>
                    <div className="status-space-y-4">
                        {incidents.map(incident => (
                            <div key={incident._id} className="status-card">
                                <div className="status-flex justify-between items-center mb-4">
                                    <h3 className="status-text-lg font-medium">{incident.title}</h3>
                                    <span className={`status-badge ${
                                        incident.impact === 'Critical' ? 'status-badge-danger' :
                                        incident.impact === 'Major' ? 'status-badge-warning' :
                                        'status-badge-success'
                                    }`}>
                                        {incident.impact}
                                    </span>
                                </div>
                                <p className="status-text-gray-700 mb-4">{incident.description}</p>
                                {incident.updates && incident.updates.length > 0 && (
                                    <div>
                                        <h4 className="status-text-sm font-medium text-gray-700 mb-2">Updates</h4>
                                        {incident.updates.map((update, index) => (
                                            <div key={index} className="status-text-sm mb-2">
                                                <p className="status-text-gray-900">{update.message}</p>
                                                <p className="status-text-gray-500">
                                                    {new Date(update.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <div className="status-card">
                    <p className="status-text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
};

export default PublicStatusPage;