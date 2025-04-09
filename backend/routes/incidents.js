const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

// Create incident
router.post('/', auth, async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!req.body.description) {
            return res.status(400).json({ message: 'Description is required' });
        }
        if (!req.body.services || !Array.isArray(req.body.services) || req.body.services.length === 0) {
            return res.status(400).json({ message: 'At least one service must be selected' });
        }

        const incident = new Incident({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'Investigating',
            impact: req.body.impact || 'None',
            services: req.body.services,
            updates: [{
                message: 'Incident created',
                status: 'Update',
                timestamp: new Date()
            }]
        });
        
        await incident.save();
        await incident.populate('services');
        
        // Get io instance and emit if available
        const io = req.app.get('io');
        if (io) {
            io.emit('incidentUpdate', incident);
        }
        
        res.status(201).json(incident);
    } catch (error) {
        console.error('Error creating incident:', error);
        res.status(400).json({ message: error.message || 'Failed to create incident' });
    }
});

// Get all incidents
router.get('/', auth, async (req, res) => {
    try {
        const incidents = await Incident.find()
            .populate('services')
            .sort('-createdAt');
        res.json(incidents);
    } catch (error) {
        console.error('Error fetching incidents:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch incidents' });
    }
});

// Get public incidents
router.get('/public', async (req, res) => {
    try {
        const incidents = await Incident.find({ status: { $ne: 'Resolved' } })
            .populate('services')
            .sort('-createdAt');
        res.json(incidents);
    } catch (error) {
        console.error('Error fetching public incidents:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch public incidents' });
    }
});

// Add update to incident
router.post('/:id/updates', auth, async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        if (!req.body.message) {
            return res.status(400).json({ message: 'Update message is required' });
        }

        incident.updates.push({
            message: req.body.message,
            status: req.body.status || 'Update',
            timestamp: new Date()
        });

        await incident.save();
        await incident.populate('services');
        
        // Get io instance and emit if available
        const io = req.app.get('io');
        if (io) {
            io.emit('incidentUpdate', incident);
        }
        
        res.json(incident);
    } catch (error) {
        console.error('Error adding update:', error);
        res.status(500).json({ message: error.message || 'Failed to add update' });
    }
});

// Resolve incident
router.post('/:id/resolve', auth, async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        incident.status = 'Resolved';
        incident.endTime = new Date();
        incident.isResolved = true;
        
        if (req.body.message) {
            incident.updates.push({
                message: req.body.message || 'Incident resolved',
                status: 'Resolved',
                timestamp: new Date()
            });
        }

        await incident.save();
        await incident.populate('services');
        
        // Get io instance and emit if available
        const io = req.app.get('io');
        if (io) {
            io.emit('incidentUpdate', incident);
        }
        
        res.json(incident);
    } catch (error) {
        console.error('Error resolving incident:', error);
        res.status(500).json({ message: error.message || 'Failed to resolve incident' });
    }
});

module.exports = router;
