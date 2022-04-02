const mongoose = require('mongoose');
const FormatteurRole = new mongoose.Schema({

    name: { type: String },
    lastname: { type: String },
    genre: { type: String },
    age: { type: Number },
    specialites: { type: String },
    image: { type: String },
    linkfacebook: { type: String },
    linklinkedin: { type: String },
    email: { type: String },
    tel: { type: String },
    password: { type: String },
    role: { type: Number }
});


module.exports = mongoose.model('Formatteur', FormatteurRole);