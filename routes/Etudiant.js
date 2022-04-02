const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const Etudiant = require('../models/Etudiant');
const Formatteur = require('../models/Formatteur');
const Admin = require('../models/Admin');
// verify method declaration which we will use it in /getall 
const verify = (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;

    if (!token) {

        res.send('token is required');

    } else {

        try {
            console.log(token);
            const verif = jwt.verify(token, 'secret123@');

        } catch (error) {
            res.status(401).send('unothaurized !!!');
        }



    }

    next();

}

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
// register + upload call + password encryption
router.post('/register', upload.single('image'), async (req, res) => {
    let obj = req.body;
    let etudiant = new Etudiant(obj);
    let FindEmailEtudiant = await Etudiant.findOne({ email: etudiant.email })
    let FindEmailFormatteur = await Formatteur.findOne({ email: etudiant.email })
    let FindEmailAdmin = await Admin.findOne({ email: etudiant.email })

    if (!FindEmailEtudiant && !FindEmailFormatteur && !FindEmailAdmin) {
        try {
            // si il n"existe pas dont registration d'un nouveau etudiant
            etudiant.image = filename;
            const salt = bcrypt.genSaltSync(10);
            etudiant.password = bcrypt.hashSync(etudiant.password, salt);
            let savedetudiant = await etudiant.save();
            if (!savedetudiant) {
                res.status(404).send('email existe')
                console.log(res)
                
            } else {
                res.status(200).send(savedetudiant)
            }


        } catch (error) {
            res.status(404).send({ message: "erreurrr", error })
        }

    }else{
        res.status(404).send({ message: 'email exist' });
    }
})
// login = 100% working
router.post('/login', async (req, res) => {

    let EtudiantData = req.body;

    try {
        let Etudiantnew = await Etudiant.findOne({ email: EtudiantData.email });

        if (!Etudiantnew) {
            res.send('not found : incorrect email');
        } else {

            const validPassword = bcrypt.compareSync(EtudiantData.password, Etudiantnew.password);

            if (validPassword == true) {

                let payload = { subject: { email: Etudiantnew.email, id: Etudiantnew._id } }
                let token = jwt.sign(payload, 'secret123@');
                res.json({ token: token });

            } else {
                res.send('invalid password');
            }
        }
    } catch (err) {
        res.send('not found');
    }
})
//get all = working 100% ( requires a token to run)
router.get('/getall', (req, res) => {
    Etudiant.find().then(
        (Etudiant) => {
            res.send(Etudiant)
        },
        (err) => {
            console.log(err);
        }
    )
});
// get By ID = 100% working
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Etudiant.findOne({ _id: id }).then(
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
    Etudiant.findByIdAndDelete({ _id: id }).then(
        (deletedEtudiant) => {
            console.log(`Formateur ${deletedEtudiant} deleted`);
            res.send(deletedEtudiant);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update = working but image is getting added not updated
router.put('/update/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let EtudiantToUpdate = req.body;

    filename.length > 0 ? EtudiantToUpdate.image = filename : null;

    Etudiant.findByIdAndUpdate({ _id: id }, EtudiantToUpdate, { new: true }).then(
        (updatedEtudiant) => {
            res.send(updatedEtudiant);
        },
        (err) => {
            res.send(err);
        }
    );
});
module.exports = router;