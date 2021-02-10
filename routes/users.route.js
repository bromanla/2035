const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const usersValidator = require('../validators/users.validator');

router.get('/', usersController.root)
router.get('/:id', usersValidator.byId, usersController.byId)

router.post('/', usersValidator.create, usersController.create)
router.post('/photo', usersController.uploadPhoto)

module.exports = {
    path: '/users',
    router
}
