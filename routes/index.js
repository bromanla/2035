module.exports = [
    require('./auth.route'),
    require('./users.route'),
    require('./teams.route'),
    require('./agents.route'),
    require('./events.route')
]

logger.debug(`${module.exports.length} routes connected`)