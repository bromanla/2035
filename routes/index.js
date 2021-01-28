module.exports = [
    require('./auth.route'),
    require('./profile.route'),
    require('./teams.route')
]

logger.debug(`${module.exports.length} routes connected`)