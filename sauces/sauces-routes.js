const express = require('express');
const router = express.Router();

const auth = require('../authentification/authentification-middleware');
const multer = require('../multer-config')

const saucesCtrl = require('./sauces-controller');


router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.put('/:id',auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.likes);

module.exports = router;