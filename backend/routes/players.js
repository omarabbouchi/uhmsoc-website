const express = require('express');
const router = express.Router();
const { getAllPlayers, addPlayer, updatePlayer, deletePlayer } = require('../controllers/playersController');
const { verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllPlayers);
router.post('/', verifyAdmin, upload.single('photo'), addPlayer);
router.put('/:number', verifyAdmin, upload.single('photo'), updatePlayer);
router.delete('/:number', verifyAdmin, deletePlayer);

module.exports = router; 
