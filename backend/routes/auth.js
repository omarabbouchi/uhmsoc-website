const express = require('express');
const router = express.Router();
const { login, createAdmin, getAllAdmins, deleteAdmin, refreshAccessToken } = require('../controllers/auth');
const { verifyAdmin } = require('../middleware/auth');

router.post('/login', login);
router.post('/create', verifyAdmin, createAdmin);
router.get('/all', verifyAdmin, getAllAdmins);
router.delete('/:id', verifyAdmin, deleteAdmin);
router.post('/refresh', refreshAccessToken);

module.exports = router; 