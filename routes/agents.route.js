const router = require('express').Router();
const agentController = require('../controllers/agents.controller');

router.get('/', agentController.root)

module.exports = {
    path: '/agents',
    router
}