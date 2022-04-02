const express = require('express');
const Question = require('../models/Question');
const router = express.Router();


// ajout d'une question
router.post('/add', (req, res) => {

    let QuestionFromreq = req.body;
    let Question1 = new Question(QuestionFromreq);

    Question1.save().then(
        (saved) => {
            console.log(saved)
            res.send(saved);
        },
        (err) => {
            res.send(err)
        }
    );
})
// get all questions
router.get('/getall', (req, res) => {
    Question.aggregate(
        [
            {
                $lookup: {
                    from: "formatteurs",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "formatteur"
                }
            },
            {
                $lookup: {
                    from: "etudiants",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "etudiant"
                }
            },

            {
                $lookup: {
                    from: "reponses",
                    localField: "_id",
                    foreignField: "idQuestion",
                    as: "Reponse"
                }
            },
            {
                $unwind: {
                    path: "$Reponse",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "formatteurs",
                    localField: "Reponse.idUser",
                    foreignField: "_id",
                    as: "Reponse.formatteur"
                }
            },
            {
                $lookup: {
                    from: "etudiants",
                    localField: "Reponse.idUser",
                    foreignField: "_id",
                    as: "Reponse.etudiant"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    description: { $first: "$description" },
                    formatteur: { $first: "$formatteur" },
                    etudiant: { $first: "$etudiant" },

                      Reponse: { $push: "$Reponse" }
                }
            }

        ]
    ).then(
        (Question1) => {
            res.send(Question1)
            console.log(Question1)
        },
        (err) => {
            console.log(err);
        }
    )
});
// delete question
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Question.findByIdAndDelete({ _id: id }).then(
        (deletedQuestion) => {
            console.log(`Question ${deletedQuestion} deleted`);
            res.send(deletedQuestion);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update question
router.put('/update/:id', (req, res) => {
    let id = req.params.id;
    let QuestionToUpdate = req.body;

    Question.findByIdAndUpdate({ _id: id }, QuestionToUpdate, { new: true }).then(
        (updatedQuestion) => {
            res.send(updatedQuestion);
        },
        (err) => {
            res.send(err);
        }
    );
});



module.exports = router;