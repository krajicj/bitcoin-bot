const express = require('express');
const router = express.Router();

const {
    login
} = require('../controller/auth');

//Login and get token
router.post('/login', login);

module.exports = router;