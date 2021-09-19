const asyncHandler = require('express-async-handler')
const db = require('../model/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc      Login 
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
   
        //Check if password correct
        const validPassword = await bcrypt.compare(req.body.password, process.env.MAIN_PASSWORD);
    
        if (!validPassword) {
            return res.status(401).send("Wrong username or password");
        }
    
        //create and assing a token
        const now = Date.now();
        const exp = now + 86400000; // one day long access
    
    
        const token = jwt.sign({ id: 'admin', iat: now, exp: exp }, process.env.MAIN_PASSWORD);
        res.header("auth-token", token).send(token);
    });
    
    

// // @desc      Register user
// // @route     POST /api/v1/auth/register
// // @access    Public
// exports.register = asyncHandler(async (req, res, next) => {
//     //Check if user does not exist
//     const userExist = await db.User.findOne({ where: { email: req.body.email } });
//     if (userExist) {
//         return res.status(400).send("User already exist");
//     }

//     //Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassowrd = await bcrypt.hash(req.body.password, salt);

//     try {
//         const user = await db.User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassowrd
//         });

//         res.send(`Successfully added user ${user.email}`);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// // @desc      Login user
// // @route     POST /api/v1/auth/login
// // @access    Public
// exports.login = asyncHandler(async (req, res, next) => {
//     //Check if user exist
//     const user = await db.User.findOne({ where: { email: req.body.email } });
//     if (!user) {
//         return res.status(401).send("Wrong username or password");
//     }

//     //Check if password correct
//     const validPassword = await bcrypt.compare(req.body.password, user.password);

//     if (!validPassword) {
//         return res.status(401).send("Wrong username or password");
//     }

//     //create and assing a token
//     const now = Date.now();
//     const exp = now + 86400000; // one day long access


//     const token = jwt.sign({ id: user.id, iat: now, exp: exp }, process.env.TOKEN_SECRET);
//     res.header("auth-token", token).send(token);
// });


