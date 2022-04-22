const express = require('express');
const Travailmaison = require('../models/Travailmaison');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
let ObjectId = require('mongodb').ObjectID;

filename = '';
const storage2 = multer.diskStorage(
    {
        destination: './depot',
        filename: function (req, file, cb) {
            date = Date.now();
            let fl = date + '.' + file.mimetype.split('/')[1];
            cb(null, fl);

            filename = fl;
        },
    }
);
const upload = multer({ storage: storage2 });
// ajouter travail maison
router.post('/add', upload.single('file'), (req, res) => {

    let TravailFromreq = req.body;
    let Travail1 = new Travailmaison(TravailFromreq);
    Travail1.file = filename;

    Travail1.save().then(
        (saved) => {
            filename = '';
            res.send(saved);
        },
        (err) => {
            console.log(err)
            res.send(err)

        }
    );
})
// get all travail maison 
router.get('/getall', (req, res) => {
    Travailmaison.find().then(
        (Travail1) => {
            res.send(Travail1)
        },
        (err) => {
            console.log(err);
        }
    )
});
// delete travail maison
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Travailmaison.findByIdAndDelete({ _id: id }).then(
        (deletedTravail) => {
            console.log(`Reponse ${deletedTravail} deleted`);
            res.send(deletedTravail);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update travail maison 
router.put('/update/:id', upload.single('file'), (req, res) => {
    let id = req.params.id;
    let TravailToUpdate = req.body;

    filename.length > 0 ? TravailToUpdate.file = filename : null;

    Travailmaison.findByIdAndUpdate({ _id: id }, TravailToUpdate, { new: true }).then(
        (updatedTravail) => {
            res.send(updatedTravail);
        },
        (err) => {
            res.send(err);
        }
    );
});
// get depot by id formatteur
router.get('/getbyidformatteur/:id', (req, res) => {
    let idFormatteur = req.params.id;
    Travailmaison.aggregate(
        [
            {
                $match: {
                    idFormatteur: new ObjectId(idFormatteur) 
                }
            },

            {
                $lookup: {
                    from: "etudiants",
                    localField: "idEtudiant",
                    foreignField: "_id",
                    as: "etudiant"
                }
            },
            {
                $lookup: {
                    from: "formations",
                    localField: "idFormation",
                    foreignField: "_id",
                    as: "formation"
                }
            }
        ])

        .then(
            (data) => {
                res.send(data);
                console.log(data)
            },
            (err) => {
                console.log(err);
                res.send(err);
            }
        );
})
// get depot by id etudiant 
router.get('/getbyidetudiant/:id', (req, res) => {
    let idEtudiant = req.params.id;
    const { ObjectId } = require('mongodb');
    const _id = ObjectId(idEtudiant);
    console.log(_id);
    Travailmaison.aggregate(
        [
            {
                $match: {
                    idEtudiant: _id 
                }
            },

            {
                $lookup: {
                    from: "formatteurs",
                    localField: "idFormatteur",
                    foreignField: "_id",
                    as: "formatteur"
                }
            },
            {
                $lookup: {
                    from: "formations",
                    localField: "idFormation",
                    foreignField: "_id",
                    as: "formation"
                }
            }
        ])
        .then(
            (data) => {
                res.send(data);
                console.log(data)
            },
            (err) => {
                res.send(err);
            }
        );
})
// get by id 
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Travailmaison.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})




module.exports = router;