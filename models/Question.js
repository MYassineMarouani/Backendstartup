const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
const Question = new mongoose.Schema({

    title: { type: String }, 
    description: { type: String }, 
    idUser: { type: ObjectId },  
});


module.exports = mongoose.model('Question', Question);