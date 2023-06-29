const express = require('express');
const { registerUser,authUser,allUsers,protect } = require("../controllers/userControllers");

const router = express.Router();

//API ENDPOINTS FOR USERS
router.route('/').post(registerUser).get(protect,allUsers);
router.route('/login').post(authUser);



module.exports = router