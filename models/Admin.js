const mongoose = require('mongoose');
const adminRole = new mongoose.Schema({

    name: { type: String },
    lastname: { type: String },
    email: { type: String },
    password: { type: String },
    image: { type: String },
    role: { type: Number },
});


module.exports = mongoose.models.Admin || mongoose.model('Admin', adminRole);;
