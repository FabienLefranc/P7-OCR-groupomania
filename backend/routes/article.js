const express = require('express');
const router = express.Router();
const articleCtrl = require('../controllers/article');
const multer = require('../middlewares/multer-config');
const { requireAuth } = require('../middlewares/auth');

router.get('/', requireAuth, articleCtrl.getAllArticles);
router.post('/', multer, articleCtrl.createArticle);
router.get('/:id', requireAuth, articleCtrl.getOneArticle);
router.get('/:id/comments', requireAuth, articleCtrl.getArticleComments);
router.put('/:id', requireAuth, articleCtrl.modifyArticle);
router.delete('/:id', requireAuth, articleCtrl.deleteArticle);

module.exports = router;