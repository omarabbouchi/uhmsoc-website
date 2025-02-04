const express = require('express');
const router = express.Router();
const { login, createAdmin, getAllAdmins, deleteAdmin } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/login', login);
router.post('/create', verifyAdmin, createAdmin); //only existing admins can create new admins
router.get('/all', verifyAdmin, getAllAdmins);
router.delete('/:id', verifyAdmin, deleteAdmin);

module.exports = router; 