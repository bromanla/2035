const router = require('express').Router()
const usersController = require('../controllers/users.controller')
const usersValidator = require('../validators/users.validator')
const { accessControl } = require('./modules/control.js')

router.get('/', usersValidator.list, usersController.list)
router.get('/:id', usersValidator.byId, usersController.byId)

router.use(accessControl)
router.post('/', usersValidator.create, usersController.create)
router.patch('/:id', usersValidator.patch, usersController.change)
router.delete('/:id', usersValidator.delete, usersController.delete)

module.exports = {
    path: '/users',
    router
}
