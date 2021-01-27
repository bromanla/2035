const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const profileValidator = require('../validators/profile.validator');

router.get('/', profileController.root)
router.get('/:id', profileValidator.profile, profileController.profile)

module.exports = {
    path: '/profile',
    router
}

