const router = require('express').Router();
const teamsController = require('../controllers/teams.controller');
const teamsValidator = require('../validators/teams.validator');

router.get('/', teamsValidator.root, teamsController.root)
router.get('/:id', teamsValidator.byId, teamsController.byId)

module.exports = {
    path: '/teams',
    router
}