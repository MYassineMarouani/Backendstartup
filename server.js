const express = require('express');
const cors = require('cors');




const mongoose = require('./config/db_config');
const AdminApi = require('./routes/Admin');
const FormatteurApi = require('./routes/Formatteur');
const EtudiantApi = require('./routes/Etudiant');
const FormationApi = require('./routes/Formation');
const EmploiApi= require('./routes/Emploi');
const QuestionsApi = require('./routes/Question');
const ReponseApi = require('./routes/Reponse');
const FeedbackApi = require('./routes/Feedback');
const Travailmaison= require('./routes/Travailmaison');
const User= require('./routes/User');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/Admin' , AdminApi);
app.use('/Formatteur',FormatteurApi);
app.use('/Etudiant',EtudiantApi);
app.use('/Formation',FormationApi);
app.use('/Emploi',EmploiApi);
app.use('/Question',QuestionsApi);
app.use('/Reponse',ReponseApi);
app.use('/Feedback',FeedbackApi);
app.use('/Travailmaison',Travailmaison);
app.use('/User',User);

// image search by name
app.use('/getimage' , express.static('./upload'));
// travail maison 
app.use('/getwork',express.static('./depot'));

app.listen(3000, () => {
    console.log('server works!');
})