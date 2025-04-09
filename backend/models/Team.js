const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }],
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
