const asyncHandler = require('express-async-handler')
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
        const token = this.createToken();
    
        res.header("auth-token", token).send(token);
    });
    
   
exports.createToken = () => {
    //create and assing a token
    const now = Date.now();
    const exp = now + 86400000; // one day long access
    const token = jwt.sign({ id: 'admin', iat: now, exp: exp }, process.env.MAIN_PASSWORD);
    return token;
}