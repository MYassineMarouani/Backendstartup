const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Etudiant = require('../models/Etudiant');
const Formatteur = require('../models/Formatteur');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');

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
    let admin = new Admin(obj);
    let FindEmailEtudiant = await Etudiant.findOne({ email: admin.email })
    let FindEmailFormatteur = await Formatteur.findOne({ email: admin.email })
    let FindEmailAdmin = await Admin.findOne({ email: admin.email })

    if (!FindEmailEtudiant && !FindEmailFormatteur && !FindEmailAdmin) {
        try {
            // si il n"existe pas dont registration d'un nouveau etudiant
            admin.image = filename;
            const salt = bcrypt.genSaltSync(10);
            admin.password = bcrypt.hashSync(admin.password, salt);
            let savedadmin = await admin.save();
            if (!savedadmin) {
                res.status(404).send('email existe')
                console.log(res)

            } else {
                res.status(200).send(savedadmin)
            }


        } catch (error) {
            res.status(404).send({ message: "erreurrr", error })
        }

    }
})

// login = 100% working
router.post('/login', async (req, res) => {

    let userdata = req.body;

    try {
        let admin1 = await Admin.findOne({ email: userdata.email });
        let etudiant1 = await Etudiant.findOne({ email: userdata.email });
        let formatteur1 = await Formatteur.findOne({ email: userdata.email });

        if (!admin1 && !etudiant1 && !formatteur1) {
            res.send('not found : incorrect email');
        } else if (admin1) {

            const validPassword = bcrypt.compareSync(userdata.password, admin1.password);

            if (validPassword == true ) {

                let payload = { subject: { email: userdata.email, id: admin1._id , role: admin1.role } }
                let token = jwt.sign(payload, 'secret123@');
                res.json({ token: token });

            } else {
                res.send('invalid password');
            }
        } else if (etudiant1) {
            const validPassword = bcrypt.compareSync(userdata.password, etudiant1.password);

            if (validPassword == true ) {

                let payload = { subject: { email: userdata.email, id: etudiant1._id , role:etudiant1.role } }
                let token = jwt.sign(payload, 'secret123@');
                res.json({ token: token });

            } else {
                res.send('invalid password');
            }

        } else if (formatteur1) {
            const validPassword = bcrypt.compareSync(userdata.password, formatteur1.password);

            if (validPassword == true ) {

                let payload = { subject: { email: userdata.email, id: formatteur1._id , role:formatteur1.role } }
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
// get By ID = 100% working
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Admin.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
// update = working but image is getting added not updated
router.put('/update/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let AdminToUpdate = req.body;

    filename.length > 0 ? AdminToUpdate.image = filename : null;

    Admin.findByIdAndUpdate({ _id: id }, AdminToUpdate, { new: true }).then(
        (updatedAdmin) => {
            res.send(updatedAdmin);
        },
        (err) => {
            res.send(err);
        }
    );
});
// get user by id ( etudiant / formatteur)
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
    if (res==err) {
        Formatteur.findOne({ _id: id }).then(
            (data) => {
                res.send(data);
            },
            (err) => {
                res.send(err);
            }
        );

    }
})
module.exports = router;

