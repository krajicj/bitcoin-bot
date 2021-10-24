const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send("Access denied");
    }

    try {
        const { id, iat, exp } = jwt.verify(token, process.env.MAIN_PASSWORD);
        const now = Date.now();
        if (now > exp) {
            return res.status(401).send("Expired token");
        }
        next();
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
});