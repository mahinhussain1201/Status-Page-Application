import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        status: 'Operational'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const socket = io('https://status-page-application-1-fy4x.onrender.com');
        fetchServices();

        socket.on('serviceUpdate', (updatedService) => {
            fetchServices();
        });

        return () => socket.disconnect();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('https://status-page-application-1-fy4x.onrender.com/api/services');
            setServices(response.data);
        } catch (error) {
            setError('Failed to fetch services');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://status-page-application-1-fy4x.onrender.com/api/services', newService);
            setNewService({
                name: '',
                description: '',
                status: 'Operational'
            });
            fetchServices();
        } catch (error) {
            setError('Failed to create service');
        }
    };

    const updateStatus = async (serviceId, newStatus) => {
        try {
            await axios.put(`https://status-page-application-1-fy4x.onrender.com/api/services/${serviceId}`, {
                status: newStatus
            });
            fetchServices();
        } catch (error) {
            setError('Failed to update service status');
        }
    };

    const deleteService = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`https://status-page-application-1-fy4x.onrender.com/api/services/${serviceId}`);
                fetchServices();
            } catch (error) {
                setError('Failed to delete service');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h2 className="card-title">Service Management</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Service Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                value={newService.description}
                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-input"
                                value={newService.status}
                                onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                            >
                                <option value="Operational">Operational</option>
                                <option value="Degraded Performance">Degraded Performance</option>
                                <option value="Partial Outage">Partial Outage</option>
                                <option value="Major Outage">Major Outage</option>
                            </select>
                        </div>
                        <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => alert('Service Added Successfully!')}
                        >
                        Add Service
                        </button>

                    </form>

                    <div className="mt-6">
                        <h3 className="section-title">Services</h3>
                        <div className="grid">
                            {services.map(service => (
                                <div key={service._id} className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">{service.name}</h4>
                                        <button
                                            onClick={() => deleteService(service._id)}
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="text-gray-600">{service.description}</p>
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-input"
                                            value={service.status}
                                            onChange={(e) => updateStatus(service._id, e.target.value)}
                                        >
                                            <option value="Operational">Operational</option>
                                            <option value="Degraded Performance">Degraded Performance</option>
                                            <option value="Partial Outage">Partial Outage</option>
                                            <option value="Major Outage">Major Outage</option>
                                        </select>
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

export default ServiceManagement;
