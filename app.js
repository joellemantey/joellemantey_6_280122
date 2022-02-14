const express = require('express'); // commonJs
// import express from "express"; // ES module

const mongoose = require('mongoose');

const path = require('path');

//ajout route Authentification:
const authentificationRoutes = require('./authentification/authentification-router');

//ajout route Sauce:
const saucesRoutes = require('./sauces/sauces-routes');

const app = express();


mongoose.connect('mongodb+srv://jmantey:cGxSaF9H3nWdR792@clusterocr.pcqh5.mongodb.net/clusterOCR?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log('Connexion à MongoDB échouée !', e));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

app.use('/images', express.static(path.join(__dirname, 'images')));

//afin d'enregistrer les routes authentification:
app.use('/api/auth', authentificationRoutes);

app.use('/api/sauces', saucesRoutes);


module.exports = app;
// export default app;