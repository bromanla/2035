module.exports = [
    require('./auth.route'),
    require('./users.route'),
    require('./teams.route'),
    require('./settings.route'),
    require('./events.route'),
    require('./vote.route'),
    require('./upload.route')
]

logger.debug(`${module.exports.length} routes connected`)