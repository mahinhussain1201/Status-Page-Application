const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Create service
router.post('/', auth, async (req, res) => {
    try {
        const service = new Service({
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            teamId: req.body.teamId
        });
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all services
router.get('/', auth, async (req, res) => {
    try {
        const services = await Service.find().populate('teamId');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get public services
router.get('/public', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update service
router.put('/:id', auth, async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                teamId: req.body.teamId
            },
            { new: true }
        );
        
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
