const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../database');

exports.me = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

//Création d'un utilisateur
exports.signup = (req, res) => {
  const { username, email, password } = req.body;

  let test_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
  let test_password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;

  if (!email.match(test_email)) {
    return res.status(401).json({
      message: "L'email est invalide !",
    });
  }
  if (!password.match(test_password)) {
    return res.status(401).json({
      message: 'Le mot de passe est invalide !',
    });
  }

  db.query(
    'SELECT email from users WHERE email = ?',
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.status(401).json({
          message: "L'email est déja utilisé !",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users SET ?',
        { username: username, email: email, password: hashedPassword },
        (error, results) => {
          if (error) {
            return res.status(500).json({
              message: error.message,
            });
          } else {
            return res.status(201).json({
              message: 'Utilisateur créé !',
            });
          }
        }
      );
    }
  );
};


//Connexion d'un utilisateur
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe sont requis',
      });
    }

    db.query(
      'SELECT * FROM USERS WHERE email = ?',
      [email],
      async (error, results) => {
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          return res.status(401).json({
            message: 'Email ou mot de passe incorrect',
          });
        } else {
          const user = results[0];

          const token = jwt.sign(
            { idUser: user.idUser },
            process.env.JWT_SECRET,
            {
              expiresIn: '24h',
            }
          );

          return res.status(200).json({
            message: 'Utilisateur connecté',
            token: token,
            user: user,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//Obtenir un user grâce à son Id
exports.getOneUser = (req, res) => {
  const ids = req.params.ids;
  const idsarray = ids.split('-');

  const users = [];

  idsarray.forEach(async (id, index, i) => {
    const long = i.length;
    const isLastRound = long === index + 1;
    db.query(`SELECT * FROM users WHERE idUser = ?`, [id], (err, result) => {
      if (!err) {
        console.log('res', result[0]);
        if (result[0]) {
          users.push(result[0]);
        }

        if (isLastRound) {
          return res.status(200).json({
            users,
          });
        }
      }
    });
  });
};

//Supprimer un utilisateur

exports.deleteUser = (req, res, next) => {
  const authUser = req.user;
  const userIdToDelete = req.params.id;

  if (!req.user) {
    return res.status(401).json({
      message: 'Vous devez vous authentifier !',
    });
  }

  if (Number(authUser.idUser) !== Number(userIdToDelete)) {
    return res.status(401).json({
      message: 'Permission refusée !',
    });
  }
  db.query(
    `DELETE FROM users WHERE idUser = ?`,
    [userIdToDelete],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      return res.status(200).json({
        message: 'Compte utilisateur supprimé !',
      });
    }
  );
}
