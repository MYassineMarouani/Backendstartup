const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const Emploi = require('../models/Emploi');
const Formation = require('../models/Formation');
let ObjectId = require('mongodb').ObjectID;

// ajout d'un nouvelle emploi = working 
router.post('/add', (req, res) => {

    let EmploiFromReq = req.body;
    let Emploinew = new Emploi(EmploiFromReq);
    Emploinew.save().then(
        (saved) => {
            res.send(saved);
        },
        (err) => {
            res.send(err)
        }
    );
})
//get all = working 100% 
router.get('/getall', (req, res) => {
    Emploi.aggregate(
        [
            {$lookup:{
                from:"formations",
                localField: "idFormation",
                foreignField: "_id",
                as:"formation"
            }}
        ]
    ).then(
        (Emploi) => {
            res.send(Emploi)
        },
        (err) => {
            console.log(err);
        }
    )
});

router.get('/getmyemplois/:id' , (req, res)=>{
    id = req.params.id
    console.log(id);
    myFormations = [];
    Formation.find()
        .then(
            (formations)=>{
                for(let f of formations){
                    for(let g of f.groupe){
                        if (id == g._id){
                            let fId = new ObjectId(f._id)
                            myFormations.push(fId);
                        }
                    }
                }

                Emploi.find({ idFormation: { $in: myFormations }  })
                    .then(
                        (data)=>{
                            console.log(data);
                            res.send(data);
                        }
                    )

            }
        )

})

router.get('/getfemplois/:id' , (req, res)=>{
    id = req.params.id
    console.log(id);
    myFormations = [];
    Formation.find()
        .then(
            (formations)=>{
                for(let f of formations){
                    if (id == f.formatteur){
                        let fId = new ObjectId(f._id)
                        myFormations.push(fId);
                    }
                }

                Emploi.find({ idFormation: { $in: myFormations }  })
                    .then(
                        (data)=>{
                            console.log(data);
                            res.send(data);
                        }
                    )

            }
        )

})



// delete = 100% working 
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Emploi.findByIdAndDelete({ _id: id }).then(
        (deletedEmploi) => {
            console.log(`Emploi ${deletedEmploi} deleted`);
            res.send(deletedEmploi);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update = working but image is getting added not updated
router.put('/update/:id', (req, res) => {
    let id = req.params.id;
    let EmploiToUpdate = req.body;


    Emploi.findByIdAndUpdate({ _id: id }, EmploiToUpdate, { new: true }).then(
        (updatedEmploi) => {
            res.send(updatedEmploi);
        },
        (err) => {
            res.send(err);
        }
    );
});
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Emploi.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
module.exports = router;