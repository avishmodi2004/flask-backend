const jwt = require('jsonwebtoken');
const SECRET_KEY = "helloworld";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // 'Bearer token'

    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

const onlyAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied for non-admin" });
    next();
};

const onlyStudent = (req, res, next) => {
    if (req.user.role !== "student")
        return res.status(403).json({ message: "Access denied for non-student" });
    next();
};

module.exports = { verifyToken, onlyAdmin, onlyStudent };
