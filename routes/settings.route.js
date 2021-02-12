const router = require('express').Router();
const settingsController = require('../controllers/settings.controller');

router.get('/agents', settingsController.agents)

module.exports = {
    path: '/settings',
    router
}