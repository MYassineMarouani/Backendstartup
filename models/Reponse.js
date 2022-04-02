const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
const Reponse = new mongoose.Schema({

    description: { type: String }, 
    idQuestion: { type: ObjectId },  
    idUser: {type:ObjectId}
});


module.exports = mongoose.model('Reponse', Reponse);