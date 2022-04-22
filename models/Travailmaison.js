const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
const Travailmaison = new mongoose.Schema({

    idEtudiant: { type: ObjectId }, 
    idFormatteur: { type: ObjectId }, 
    idFormation: { type: ObjectId },
    file: { type: String }, 
    date: { type: String }, 
    description: { type: String }, 
    etat: { type: String }, 
    remarques: { type: String }, 
   
});


module.exports = mongoose.model('Travailmaison', Travailmaison);