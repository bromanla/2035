const router = require('express').Router();
const eventsController = require('../controllers/events.controller');
const eventsValidator = require('../validators/events.validator');

router.get('/', eventsValidator.list, eventsController.list)
router.get('/:id', eventsValidator.byId, eventsController.byId)

module.exports = {
    path: '/events',
    router
}
