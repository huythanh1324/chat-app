const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const userRouter = express.Router()

userRouter.route('/login').post(authUser)
userRouter.route('/register').post(registerUser)
userRouter.get('/',protect,allUsers)


module.exports= userRouter;
