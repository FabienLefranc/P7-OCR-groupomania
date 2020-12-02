const jwt = require('jsonwebtoken');
const db = require('../database');

module.exports = {
  requireAuth: function (req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        message: 'No token provided',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: error.message,
        });
      } else {
        db.query(
          'SELECT * FROM USERS WHERE idUser = ?',
          [decoded.idUser],
          async (error, results) => {
            if (!results) {
              return res.status(401).json({
                message: `Jeton d'authentification invalide`,
              });
            } else {
              const user = results[0];
              delete user.password;
              req.user = user;
              next();
            }
          }
        );
      }
    });
  },
};
