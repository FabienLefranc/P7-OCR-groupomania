const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();
const db = require('./database');

//Rajouter rate-limit

//routes
const articleRoutes = require('./routes/article');
const commentaireRoutes = require('./routes/commentaire');
const userRoutes = require('./routes/user');


//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


//Connexion à la base de données
db.connect(err => {
    if(!err) {
        console.log(`la base de données est connectée`);
    } else {
        console.log("Erreur de connexion à la base de données");
    }
})


app.use(helmet());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes
app.use('/api/article', articleRoutes);
app.use('/api/commentaire', commentaireRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;