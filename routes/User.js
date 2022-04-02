const express = require('express');
const router = express.Router();
const Etudiant = require('../models/Etudiant');
const Formatteur = require('../models/Formatteur');



router.post('/login', async (req, res) => {

    let FormateurData = req.body;
    let EtudiantData = req.body;

    try {
        let Formateur = await Formatteur.findOne({ email: FormateurData.email });
        let Etudiant = await Etudiant.findOne({ email: EtudiantData.email });

        if (!Formateur && !Etudiant) {
            res.send('not found : incorrect email');
        } else {

            const validPasswordFormatteur = bcrypt.compareSync(FormateurData.password, Formateur.password);
            const validPasswordEtudiant = bcrypt.compareSync(EtudiantData.password, Etudiant.password);

            if (validPasswordFormatteur == true) {

                let payload = { subject: { email: Formateur.email, id: Formateur._id } }
                let token = jwt.sign(payload, 'secret123@');
                res.json({ token: token });

            } else {
                res.send('invalid password');
            }
            if (validPasswordEtudiant == true) {

                let payload = { subject: { email: Etudiant.email, id: Etudiant._id } }
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
module.exports = router;