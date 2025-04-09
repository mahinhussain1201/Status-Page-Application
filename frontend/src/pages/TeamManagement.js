import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TeamManagement = () => {
    const { user } = useAuth();
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [newTeam, setNewTeam] = useState({ 
        name: '',
        description: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTeams();
        fetchUsers();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/teams');
            setTeams(response.data);
        } catch (error) {
            setError('Failed to fetch teams');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/teams/get-users');
            setUsers(response.data);
        } catch (error) {
            setError('Failed to fetch users');
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/teams', newTeam);
            setNewTeam({ name: '', description: '' });
            fetchTeams();
            setError('');
        } catch (error) {
            setError('Failed to create team');
        }
    };

    const handleAddMember = async (teamId, userId, role = 'member') => {
        try {
            await axios.post(`http://localhost:8000/api/teams/${teamId}/members`, {
                userId,
                role
            });
            fetchTeams();
            setError('');
        } catch (error) {
            setError('Failed to add team member');
        }
    };

    const handleRemoveMember = async (teamId, userId) => {
        try {
            await axios.delete(`http://localhost:8000/api/teams/${teamId}/members/${userId}`);
            fetchTeams();
            setError('');
        } catch (error) {
            setError('Failed to remove team member');
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            try {
                await axios.delete(`http://localhost:8000/api/teams/${teamId}`);
                fetchTeams();
                setError('');
            } catch (error) {
                setError('Failed to delete team');
            }
        }
    };

    const handleUpdateTeam = async (teamId, updates) => {
        try {
            await axios.put(`http://localhost:8000/api/teams/${teamId}`, updates);
            fetchTeams();
            setError('');
        } catch (error) {
            setError('Failed to update team');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1 className="card-title">Team Management</h1>

                    {/* Create New Team Form */}
                    <div className="card">
                        <h3 className="section-title">Create New Team</h3>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleCreateTeam} className="form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                    className="form-input"
                                    rows="3"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary"
                             onClick={() => alert('Team Added Successfully!')}>
                                Create Team
                            </button>
                        </form>
                    </div>

                    {/* Teams List */}
                    <div className="card">
                        <h3 className="section-title">Teams</h3>
                        <div className="grid">
                            {teams.map(team => (
                                <div key={team._id} className="card">
                                    <div className="card-header">
                                        <h4 className="text-lg font-medium">
                                            {team.name}
                                        </h4>
                                        <button
                                            onClick={() => handleDeleteTeam(team._id)}
                                            className="btn btn-danger"
                                        >
                                            Delete Team
                                        </button>
                                    </div>
                                    
                                    {team.description && (
                                        <p className="text-sm text-gray-600 mb-4">
                                            {team.description}
                                        </p>
                                    )}

                                    {/* Team Members */}
                                    <div>
                                        <h5 className="section-title">Team Members</h5>
                                        <div className="space-y-2">
                                        {team.members
                                            .filter(member => member.userId) // filter out null/undefined users
                                            .map((member) => (
                                                <div key={member.userId._id} className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <span 
                                                        style={{marginRight:'10px'}}>{member.userId.username}
                                                        </span>
                                                        <span className={`badge ${
                                                            member.role === 'admin' ? 'badge-warning' : 'badge-success'
                                                        }`}>
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                    {user._id !== member.userId._id && (
                                                        <button
                                                            onClick={() => handleRemoveMember(team._id, member.userId._id)}
                                                            className="btn btn-danger"
                                                            style={{marginBottom:'10px', marginTop:'10px'}}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                        ))}

                                        </div>

                                        {/* Add Member Form */}
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const userId = e.target.userId.value;
                                                const role = e.target.role.value;
                                                if (userId) {
                                                    handleAddMember(team._id, userId, role);
                                                    e.target.userId.value = '';
                                                }
                                            }}
                                            className="form-group mt-4"
                                        >
                                            <div className="flex space-x-2">
                                                <select
                                                    name="userId"
                                                    className="form-input"
                                                    required
                                                >
                                                    <option value="">Select a user...</option>
                                                    {users
                                                        .filter(u => !team.members.find(m => m.userId && m.userId._id === u._id))
                                                        .map(user => (
                                                            <option key={user._id} value={user._id}>
                                                                {user.username}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                                <select
                                                    name="role"
                                                    className="form-input"
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    style={{marginTop:'10px'}}
                                                >
                                                    Add Member
                                                </button>
                                            </div>
                                        </form>
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

export default TeamManagement;
