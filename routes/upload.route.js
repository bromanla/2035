const router = require('express').Router()
const uploadController = require('../controllers/upload.controller')
const { accessControl } = require('./entities')

router.use(accessControl)
router.get('/users', uploadController.usersList)
router.post('/users', uploadController.usersPhoto)

module.exports = {
    path: '/upload',
    router
}