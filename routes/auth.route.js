const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');

router.post('/login', authValidator.login, authController.login)
router.post('/refresh', authValidator.refresh, authController.refresh)
router.post('/logout', authValidator.logout, authController.logout)

module.exports = {
    path: '/auth',
    router
}

