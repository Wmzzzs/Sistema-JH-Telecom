const express = require('express');
const router = express.Router();

const { login, getUsers, logout } = require('../controllers/authController');

router.post('/login', login);
router.get('/users', getUsers);
router.post('/logout', logout);

module.exports = router;