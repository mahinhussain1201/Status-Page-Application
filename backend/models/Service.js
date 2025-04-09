const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['Operational', 'Degraded Performance', 'Partial Outage', 'Major Outage'],
        default: 'Operational'
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
