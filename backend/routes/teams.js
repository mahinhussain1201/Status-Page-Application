const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create team
router.post('/', auth, async (req, res) => {
    try {
        const team = new Team({
            name: req.body.name,
            description: req.body.description,
            members: [{ userId: req.user._id, role: 'admin' }]
        });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all teams
router.get('/', auth, async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('members.userId', 'username email')
            .populate('services');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add member to team
router.post('/:id/members', auth, async (req, res) => {
    try {
        const { userId, role } = req.body;
        const team = await Team.findById(req.params.id);
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        
        // Check if user exists
        const user = await User.findById(userId);
        
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Add member if not already in team
        if (!team.members.find(m => m.userId && m.userId.toString() === userId)) {
            team.members.push({ userId, role: role || 'member' });
            await team.save();
        }
        
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Get all users
router.get('/get-users', auth, async (req, res) => {
    try {
        const users = await User.find({}, '_id username email');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Remove member from team
router.delete('/:id/members/:userId', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        
        team.members = team.members.filter(
            member => member.userId && member.userId.toString() !== req.params.userId
        );
        await team.save();
        
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update team
router.put('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description
            },
            { new: true }
        ).populate('members.userId', 'username email')
         .populate('services');
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete team
router.delete('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
