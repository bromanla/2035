module.exports = [
    require('./auth.route'),
    require('./profile.route'),
    require('./teams.route'),
    require('./agent.controller')
]

logger.debug(`${module.exports.length} routes connected`)