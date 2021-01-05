const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserControllers = require('../controllers/users');


router.post('/signup', UserControllers.signUp);

router.post('/login', UserControllers.login);

router.delete('/:userId', checkAuth, UserControllers.deleteUser);

module.exports = router;