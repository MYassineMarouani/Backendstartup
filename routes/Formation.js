const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const Formation = require('../models/Formation');

// image upload declarartion 
filename = '';
const storage1 = multer.diskStorage(
    {
        destination: './upload',
        filename: function (req, file, cb) {
            date = Date.now();
            let fl = date + '.' + file.mimetype.split('/')[1];
            cb(null, fl);

            filename = fl;
        },
    }
);
const upload = multer({ storage: storage1 });
// ajout d'une nouvelle formation = working but problem in date
router.post('/add', upload.single('image'), (req, res) => {

    let FormationFromReq = req.body;
    let v = JSON.parse(FormationFromReq.groupe)
    console.log(v)
    let Formationnew = new Formation(FormationFromReq);
    Formationnew.image = filename;
    Formationnew.groupe = v
    console.log(Formationnew)
    Formationnew.save().then(
        (saved) => {
            filename = ''; // !!!!!
            res.send(saved);
        },
        (err) => {
            res.send(err)
        }
    );
})
//get all = working 100% 
router.get('/getall', (req, res) => {
    Formation.aggregate(

            [
               {
                $lookup: {
                    from: "formatteurs",
                    localField: "formatteur",
                    foreignField:"_id",
                    as: 'formatteur'
                }
               }
            ]
    ).then(
        formations=>{
            console.log(formations);
            res.send(formations)
        }
    )
});
// get By ID = 100% working
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Formation.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
// delete = 100% working 
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Formation.findByIdAndDelete({ _id: id }).then(
        (deletedFormation) => {
            console.log(`Formation ${deletedFormation} deleted`);
            res.send(deletedFormation);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update = working but image is getting added not updated
router.put('/update/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let FormationToUpdate = req.body;
    let v = JSON.parse(FormationToUpdate.groupe)
    console.log(v)
    FormationToUpdate.groupe = v

    filename.length > 0 ? FormationToUpdate.image = filename : null;

    Formation.findByIdAndUpdate({ _id: id }, FormationToUpdate, { new: true }).then(
        (updatedFormation) => {
            res.send(updatedFormation);
        },
        (err) => {
            res.send(err);
        }
    );
});
// get formations by id formatteur 
router.get('/getformationsbyidformatteur/:id', (req, res) => {
    let id = req.params.id;
    Formation.find({ formatteur: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
module.exports = router;