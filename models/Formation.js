const mongoose = require('mongoose');

let ObjectId = require('mongodb').ObjectID;

const Formation = new mongoose.Schema({

    title: { type: String },
    description: { type: String },
    date: { type: String },
    nbr_heur: { type: Number },
    formatteur: { type: ObjectId },
    sprecialites: { type: String },
    image: { type: String },
    groupe: { type: Array },
    prix: { type: Number },
    technologies: { type: String },
});


module.exports = mongoose.model('Formation', Formation);