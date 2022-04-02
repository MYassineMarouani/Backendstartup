const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
const Feedback = new mongoose.Schema({

    description: { type: String }, 
    idFormation: { type: ObjectId },  
    idUser: {type:ObjectId}
});


module.exports = mongoose.model('Feedback', Feedback);