const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();



// ajout d'un feedback
router.post('/add' , (req, res)=>{

    let FeedbackFromreq = req.body;
    let Feedback1 = new Feedback(FeedbackFromreq);

    Feedback1.save().then(
        (saved)=>{
            res.send(saved);
        },
        (err)=>{
            res.send(err)
        }
    );
})  
// get all feedbacks
router.get('/getall', (req, res) => {
    Feedback.aggregate(

        [
           {
            $lookup: {
                from: "formations",
                localField: "idFormation",
                foreignField:"_id",
                as: 'formation'
            }
           },
           {
            $lookup: {
                from: "etudiants",
                localField: "idUser",
                foreignField:"_id",
                as: 'utilisateur'
            }
           }
        ]
    ).then(
        (Feedback1) => {
            res.send(Feedback1)
        },
        (err) => {
            console.log(err);
        }
    )
});
// delete feedback
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Feedback.findByIdAndDelete({ _id: id }).then(
        (deletedFeedback) => {
            console.log(`Feedback ${deletedFeedback} deleted`);
            res.send(deletedFeedback);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update feedback
router.put('/update/:id', (req, res) => {
    let id = req.params.id;
    let FeedbackToUpdate = req.body;

    Feedback.findByIdAndUpdate({ _id: id }, FeedbackToUpdate, { new: true }).then(
        (updatedFeedback) => {
            res.send(updatedFeedback);
        },
        (err) => {
            res.send(err);
        }
    );
});
//get feedback by id formation
router.get('/getbyid/:id', (req, res) => {
    let idFormation = req.params.id;
    Feedback.find({ idFormation: idFormation }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})




module.exports = router;