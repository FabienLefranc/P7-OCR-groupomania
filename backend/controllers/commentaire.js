const db = require('../database');

// récupérer tous les commentaires
exports.getAllComments = (req, res, next) => {
  db.query('SELECT * FROM comments', async (error, results) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    return res.status(200).json({
      data: results,
    });
  });
};

// créer un commentaire
exports.createComment = (req, res, next) => {
  const { id_article, id_user, body } = req.body;

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //Janvier est considéré comme 0 !
  const yyyy = today.getFullYear();
  const hour = String(today.getHours()).padStart(2, '0');
  const min = String(today.getMinutes()).padStart(2, '0');
  const sec = String(today.getSeconds()).padStart(2, '0');

  const post_date = `${yyyy}-${mm}-${dd} ${hour}:${min}:${sec}`;

  db.query(
    'INSERT INTO comments SET ?',
    { id_article, id_user, body, post_date },
    async (error) => {
      if (error) {
        return res.status(500).json({
          messageIntern: error.message,
          messagePublic: "Un erreur s'est produite, réessayer plus tard !",
        });
      }

      return res.status(200).json({
        message: 'Commentaire correctement créé !',
      });
    }
  );
};

//récupérer un commentaire
exports.getOneComment = (req, res, next) => {};

//modifier un commentaire
exports.modifyComment = (req, res, next) => {};

//supprimer un commentaire
exports.deleteComment = (req, res, next) => {};
