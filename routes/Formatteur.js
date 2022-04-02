const express = require('express');
const bcrypt = require('bcrypt');
const Formatteur = require('../models/Formatteur');
const Admin = require('../models/Admin');
const Etudiant = require('../models/Etudiant');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
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
    let formatteur = new Formatteur(obj);
    let FindEmailEtudiant = await Etudiant.findOne({ email: formatteur.email })
    let FindEmailFormatteur = await Formatteur.findOne({ email: formatteur.email })
    let FindEmailAdmin = await Admin.findOne({ email: formatteur.email })

    if (!FindEmailEtudiant && !FindEmailFormatteur && !FindEmailAdmin) {
        try {
            // si il n"existe pas dont registration d'un nouveau formatteur
            formatteur.image = filename;
            const salt = bcrypt.genSaltSync(10);
            formatteur.password = bcrypt.hashSync(formatteur.password, salt);
            let savedformatteur = await formatteur.save();
            if (!savedformatteur) {
                res.status(404).send('email existe')
                console.log(res)
                
            } else {
                res.status(200).send(savedformatteur)
            }


        } catch (error) {
            res.status(404).send({ message: "erreurrr", error })
        }

    }
})
// login = 100% working
router.post('/login', async (req, res) => {

    let FormateurData = req.body;

    try {
        let Formateur = await Formatteur.findOne({ email: FormateurData.email });

        if (!Formateur) {
            res.send('not found : incorrect email');
        } else {

            const validPassword = bcrypt.compareSync(FormateurData.password, Formateur.password);

            if (validPassword == true) {

                let payload = { subject: { email: Formateur.email, id: Formateur._id } }
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
    Formatteur.find().then(
        (Formateur) => {
            res.send(Formateur)
        },
        (err) => {
            console.log(err);
        }
    )
});
// get By ID = 100% working
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Formatteur.findOne({ _id: id }).then(
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
    Formatteur.findByIdAndDelete({ _id: id }).then(
        (deletedFormateur) => {
            console.log(`Formateur ${deletedFormateur} deleted`);
            res.send(deletedFormateur);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update = working but image is getting added not updated
router.put('/update/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let FormateurToUpdate = req.body;

    filename.length > 0 ? FormateurToUpdate.image = filename : null;

    Formatteur.findByIdAndUpdate({ _id: id }, FormateurToUpdate, { new: true }).then(
        (updatedFormateur) => {
            res.send(updatedFormateur);
        },
        (err) => {
            res.send(err);
        }
    );
});
module.exports = router;