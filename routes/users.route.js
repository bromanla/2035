const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const usersValidator = require('../validators/users.validator');

router.get('/', usersValidator.list, usersController.list)
router.get('/:id', usersValidator.byId, usersController.byId)

router.post('/', usersValidator.create, usersController.create)

module.exports = {
    path: '/users',
    router
}
