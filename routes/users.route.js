const router = require('express').Router()
const usersController = require('../controllers/users.controller')
const usersValidator = require('../validators/users.validator')
const { accessControl } = require('./entities')

router.get('/', usersValidator.list, usersController.list)
router.get('/:id', usersValidator.byId, usersController.byId)
router.post('/', accessControl, usersValidator.create, usersController.create)
// router.patch('/:id', accessControl, usersController.change)

module.exports = {
    path: '/users',
    router
}
