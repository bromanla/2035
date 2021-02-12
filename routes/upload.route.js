const router = require('express').Router();
const uploadController = require('../controllers/upload.controller');

router.use((req, res, next) => {
    if (req.jwt.role !== 'moderator')
        return res.status(403).json({ error: {msg: 'No access rights to the method'}})

    next()
})

router.get('/users', uploadController.usersList)
router.post('/users', uploadController.usersPhoto)

module.exports = {
    path: '/upload',
    router
}