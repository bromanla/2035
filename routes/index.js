module.exports = [
    require('./auth.route'),
    require('./profile.route'),
    require('./teams.route'),
    require('./agents.route'),
    require('./events.route')
]

logger.debug(`${module.exports.length} routes connected`)