const router = require('express').Router();
const agentController = require('../controllers/agent.controller');

router.get('/', agentController.root)

module.exports = {
    path: '/agent',
    router
}