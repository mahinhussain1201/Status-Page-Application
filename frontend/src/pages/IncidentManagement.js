import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const IncidentManagement = () => {
    const [incidents, setIncidents] = useState([]);
    const [services, setServices] = useState([]);
    const [newIncident, setNewIncident] = useState({
        title: '',
        description: '',
        status: 'Investigating',
        impact: 'None',
        services: []
    });
    const [selectedServices, setSelectedServices] = useState([]);
    const [updateMessage, setUpdateMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [serviceStatus, setServiceStatus] = useState({});

    useEffect(() => {
        const socket = io('https://status-page-application-1-fy4x.onrender.com');
        fetchIncidents();
        fetchServices();

        socket.on('incidentUpdate', () => {
            fetchIncidents();
            fetchServices(); // Refresh services to get updated status
        });

        return () => socket.disconnect();
    }, []);

    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://status-page-application-1-fy4x.onrender.com/api/incidents');
            setIncidents(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch incidents');
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://status-page-application-1-fy4x.onrender.com/api/services');
            setServices(response.data);
            
            // Create a map of service status
            const statusMap = {};
            response.data.forEach(service => {
                statusMap[service._id] = service.status;
            });
            setServiceStatus(statusMap);
            
            setError('');
        } catch (error) {
            setError('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const incidentData = {
                title: newIncident.title,
                description: newIncident.description,
                status: newIncident.status,
                impact: newIncident.impact,
                services: selectedServices // Use selectedServices array directly
            };
            
            const response = await axios.post('https://status-page-application-1-fy4x.onrender.com/api/incidents', incidentData);
            
            // Update affected services status only after incident is created
            if (response.data) {
                for (const serviceId of selectedServices) {
                    await axios.put(`https://status-page-application-1-fy4x.onrender.com/api/services/${serviceId}`, {
                        status: getServiceStatusFromImpact(newIncident.impact)
                    });
                }
                
                setNewIncident({
                    title: '',
                    description: '',
                    status: 'Investigating',
                    impact: 'None',
                    services: []
                });
                setSelectedServices([]);
                setError('');
                fetchIncidents();
                fetchServices();
            }
        } catch (error) {
            console.error('Error creating incident:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to create incident');
        } finally {
            setLoading(false);
        }
    };

    const addUpdate = async (incidentId) => {
        try {
            setLoading(true);
            await axios.post(`https://status-page-application-1-fy4x.onrender.com/api/incidents/${incidentId}/updates`, {
                message: updateMessage,
                status: 'Update'
            });
            setUpdateMessage('');
            setError('');
            fetchIncidents();
        } catch (error) {
            setError('Failed to add update');
        } finally {
            setLoading(false);
        }
    };

    const resolveIncident = async (incidentId, affectedServices) => {
        try {
            setLoading(true);
            await axios.post(`https://status-page-application-1-fy4x.onrender.com/api/incidents/${incidentId}/resolve`);
            
            // Reset affected services status to Operational
            for (const serviceId of affectedServices) {
                await axios.put(`https://status-page-application-1-fy4x.onrender.com/api/services/${serviceId}`, {
                    status: 'Operational'
                });
            }
            
            setError('');
            fetchIncidents();
            fetchServices();
        } catch (error) {
            setError('Failed to resolve incident');
        } finally {
            setLoading(false);
        }
    };

    const getServiceStatusFromImpact = (impact) => {
        switch (impact) {
            case 'Critical':
                return 'Major Outage';
            case 'Major':
                return 'Partial Outage';
            case 'Minor':
                return 'Degraded Performance';
            default:
                return 'Operational';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Investigating':
                return 'badge-warning';
            case 'Identified':
                return 'badge-warning';
            case 'Monitoring':
                return 'badge-success';
            case 'Resolved':
                return 'badge-success';
            default:
                return 'badge';
        }
    };

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'Critical':
                return 'badge-danger';
            case 'Major':
                return 'badge-warning';
            case 'Minor':
                return 'badge-success';
            case 'None':
                return 'badge';
            default:
                return 'badge';
        }
    };

    const getServiceStatusColor = (status) => {
        switch (status) {
            case 'Major Outage':
                return 'badge-danger';
            case 'Partial Outage':
                return 'badge-warning';
            case 'Degraded Performance':
                return 'badge-warning';
            case 'Operational':
                return 'badge-success';
            default:
                return 'badge';
        }
    };

    if (loading && !incidents.length && !services.length) {
        return (
            <div className="container">
                <div className="card">
                    <div className="text-center py-4">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1 className="card-title">Incident Management</h1>

                    {/* Create New Incident Form */}
                    <div className="card">
                        <h3 className="section-title">Create New Incident</h3>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={newIncident.title}
                                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    value={newIncident.description}
                                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                                    className="form-input"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    value={newIncident.status}
                                    onChange={(e) => setNewIncident({ ...newIncident, status: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="Investigating">Investigating</option>
                                    <option value="Identified">Identified</option>
                                    <option value="Monitoring">Monitoring</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="impact" className="form-label">Impact</label>
                                <select
                                    id="impact"
                                    value={newIncident.impact}
                                    onChange={(e) => setNewIncident({ ...newIncident, impact: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="None">None</option>
                                    <option value="Minor">Minor</option>
                                    <option value="Major">Major</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="services" className="form-label">Affected Services</label>
                                <select
                                    id="services"
                                    multiple
                                    value={selectedServices}
                                    onChange={(e) => setSelectedServices(
                                        Array.from(e.target.selectedOptions, option => option.value)
                                    )}
                                    className="form-input"
                                    required
                                >
                                    {services.map(service => (
                                        <option key={service._id} value={service._id}>
                                            {service.name} - {service.status}
                                        </option>
                                    ))}
                                </select>
                                <small className="text-gray-500">
                                    Hold Ctrl/Cmd to select multiple services. Selected services' status will be updated based on incident impact.
                                </small>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading || !selectedServices.length}
                                onClick={() => alert('Incident Added Successfully!')}
                                >
                                Create Incident
                            </button>
                        </form>
                    </div>

                    {/* Active Incidents */}
                    <div className="card">
                        <h3 className="section-title">Active Incidents</h3>
                        <div className="grid">
                            {incidents
                                .filter(incident => incident.status !== 'Resolved')
                                .map(incident => (
                                    <div key={incident._id} className="card" >
                                        <div className="card-header">
                                            <h4 className="text-lg font-medium">{incident.title}</h4>
                                            <div className="flex space-x-2">
                                                <span className={`badge ${getStatusColor(incident.status)}`}>
                                                    {incident.status}
                                                </span>
                                                <span className={`badge ${getImpactColor(incident.impact)}`}>
                                                    {incident.impact}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-4">{incident.description}</p>

                                        {incident.services && incident.services.length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Affected Services</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {incident.services.map(service => (
                                                        <span key={service._id} className={`badge ${getServiceStatusColor(serviceStatus[service._id])}`}>
                                                            {service.name} - {serviceStatus[service._id]}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Updates</h5>
                                            <div className="space-y-2">
                                                {incident.updates.map((update, index) => (
                                                    <div key={index} className="update-item">
                                                        <div className="flex justify-between">
                                                            {/* <span className="text-gray-600">
                                                                {new Date(update.timestamp).toLocaleString()}
                                                            </span> */}
                                                            <span className={`badge ${getStatusColor(update.status)}`}>
                                                                {update.status}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1">{update.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Add an update..."
                                                    value={updateMessage}
                                                    onChange={(e) => setUpdateMessage(e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => addUpdate(incident._id)}
                                                    disabled={loading || !updateMessage.trim()}
                                                    className="btn btn-primary"
                                                >
                                                    Add Update
                                                </button>
                                                <button
                                                    onClick={() => resolveIncident(incident._id, incident.services.map(s => s._id))}
                                                    disabled={loading}
                                                    className="btn btn-success"
                                                    style={{margin:'10px'}}
                                                >
                                                    Resolve Incident
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Resolved Incidents */}
                    <div className="card">
                        <h3 className="section-title">Resolved Incidents</h3>
                        <div className="grid">
                            {incidents
                                .filter(incident => incident.status === 'Resolved')
                                .map(incident => (
                                    <div key={incident._id} className="card">
                                        <div className="card-header">
                                            <h4 className="text-lg font-medium">{incident.title}</h4>
                                            <div className="flex space-x-2" >
                                                <span className={`badge ${getStatusColor(incident.status)}`}>
                                                    {incident.status}
                                                </span>
                                                <span className={`badge ${getImpactColor(incident.impact)}`}>
                                                    {incident.impact}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-4">{incident.description}</p>

                                        {incident.services && incident.services.length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Affected Services</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {incident.services.map(service => (
                                                        <span key={service._id} className="badge" style={{margin:'4px'}}>
                                                            {service.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Resolution</h5>
                                            <div className="update-item">
                                                <div className="flex justify-between">
                                                    {/* <span className="text-gray-600">
                                                        {new Date(incident.updates[incident.updates.length - 1].timestamp).toLocaleString()}
                                                    </span> */}
                                                    <span className={`badge ${getStatusColor('Resolved')}`}>
                                                        Resolved
                                                    </span>
                                                </div>
                                                <p className="mt-1">{incident.updates[incident.updates.length - 1].message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default IncidentManagement;
