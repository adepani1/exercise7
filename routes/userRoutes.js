const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

// get sign up form - we did this
router.get('/new', controller.signup);

router.post('/', controller.addUser);

// get the login form - we did this
router.get('/login', controller.login);

// process login request - we did this
router.post('/login', controller.loginSubmit);

//get profile - we did this
router.get('/profile', controller.profile);

//logout the user to close session - we did this
router.get('/logout', controller.logout);


module.exports = router;