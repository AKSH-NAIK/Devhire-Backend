const express = require('express');
const router = express.Router();

const { testUser, registerUser } =
    require('../controllers/userController');

router.get('/test', testUser);
router.post('/register', registerUser);

module.exports = router;
