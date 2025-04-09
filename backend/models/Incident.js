const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Investigating', 'Identified', 'Monitoring', 'Resolved'],
        default: 'Investigating'
    },
    impact: {
        type: String,
        enum: ['None', 'Minor', 'Major', 'Critical'],
        default: 'None'
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    updates: [{
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Update', 'Resolved'],
            default: 'Update'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    isResolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Incident', incidentSchema);
