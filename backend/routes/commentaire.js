const express = require('express');
const router = express.Router();

const commentaireCtrl = require('../controllers/commentaire');

router.get('/', commentaireCtrl.getAllComments);
router.post('/', commentaireCtrl.createComment);
router.get('/:id', commentaireCtrl.getOneComment);
router.put('/:id', commentaireCtrl.modifyComment);
router.delete('/:id', commentaireCtrl.deleteComment);

module.exports = router;