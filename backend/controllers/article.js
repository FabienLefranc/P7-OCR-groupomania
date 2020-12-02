const jwt = require('jsonwebtoken');
const db = require('../database');

// récupérer tous les articles
exports.getAllArticles = (req, res, next) => {
  db.query('SELECT * FROM articles', async (error, results) => {
    return res.status(200).json({
      data: results,
    });
  });
};

// créer un article
exports.createArticle = (req, res, next) => {
  const { title, text: description, token, userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: 'Non authorisé',
    });
  }
  if (!title || !description) {
    return res.status(400).json({
      message: 'Titre et description requis !',
    });
  }
  if (!req.file) {
    return res.status(400).json({
      message: 'Image requise !',
    });
  }

  db.query(
    'SELECT * FROM users WHERE id_user = ?',
    [userId],
    async (err, results) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      const user = results[0];

      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          return res.status(401).json({
            message: error.message,
          });
        }

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //Janvier est considéré comme 0 !
        const yyyy = today.getFullYear();
        const hour = String(today.getHours()).padStart(2, '0');
        const min = String(today.getMinutes()).padStart(2, '0');
        const sec = String(today.getSeconds()).padStart(2, '0');

        const date = `${yyyy}-${mm}-${dd} ${hour}:${min}:${sec}`;

        db.query(
          'INSERT INTO articles SET ?',
          {
            title,
            description,
            posted_date: date,
            id_user: userId,
            image_url: `${req.file.filename}`,
          },
          async (error) => {
            if (error) {
              return res.status(500).json({
                messageIntern: error.message,
                messagePublic: "Une erreur s'est produite, réessayer plus tard !",
              });
            }

            return res.redirect(`http://127.0.0.1:5500/frontend/index.html`);
          }
        );
      });
    }
  );
};

//récupérer un article
exports.getOneArticle = (req, res, next) => {
  const articleId = req.params.id;

  db.query(
    `SELECT * FROM articles WHERE id_article = ?`,
    [articleId],
    async (error, results) => {
      if (error) {
        return res.status(404).json({
          message: "Pas d'article trouvé !",
        });
      }
      return res.status(200).json({
        data: results[0],
      });
    }
  );
};

//Récupérer un commentaire d'un article 
exports.getArticleComments = (req, res, next) => {
  const articleId = req.params.id;

  db.query(
    `SELECT * FROM comments WHERE id_article = ?`,
    [articleId],
    async (error, results) => {
      if (error) {
        return res.status(404).json({
          message: error.message,
        });
      }
      return res.status(200).json({
        data: results,
      });
    }
  );
};

//modifier un article
exports.modifyArticle = (req, res, next) => {
  
};

//supprimer un article
exports.deleteArticle = (req, res, next) => {};
