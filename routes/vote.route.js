const router = require('express').Router()
const voteController = require('../controllers/vote.controller')
const voteValidator = require('../validators/vote.validator')

// in dev
// router.get('/guest/:id', voteValidator.guest, voteController.guest)
// router.get('/audience/:id', voteValidator.audience, voteController.audience)

module.exports = {
    path: '/vote',
    router
}
