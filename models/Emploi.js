const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
const Emploi = new mongoose.Schema({

    title: { type: String },
    description: { type: String },
    date_debut: { type: String },
    date_fin: { type: String },
    idFormation: { type: ObjectId },
});


module.exports = mongoose.model('Emploi', Emploi);