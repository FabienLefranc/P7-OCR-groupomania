const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth');

const userCtrl = require('../controllers/user');

router.get('/me', requireAuth, userCtrl.me);
router.get('/users/:ids', userCtrl.getOneUser);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/:id', userCtrl.modifyUser);
router.delete('/:id', requireAuth, userCtrl.deleteUser);

module.exports = router;