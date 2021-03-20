const router = require('express').Router()
const voteController = require('../controllers/vote.controller')
const voteValidator = require('../validators/vote.validator')

// todo: refactoring
// router.get('/guest/:id', voteValidator.guest, voteController.guest)
router.post('/audience/:id', voteValidator.audience, voteController.audience)

module.exports = {
    path: '/vote',
    router
}
