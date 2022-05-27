const jwt = require('jsonwebtoken');

// Middleware para validar el token (rutas protegidas)
const requiresAuth = (req, res, next) => {
    // const token = req.headers.authorization;
    const token = req.query.token;

    // Se verifica si el request posee el header authorization
    if (!token) return res.status(401).json({ error: 'No token provided.', code: 401 });

    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ error: 'Invalid token', token_error: err, code: 401 });
            // res.redirect('/login');
        } else {
            req.user = decodedToken;
            next();
        }
    });
}

module.exports = requiresAuth;