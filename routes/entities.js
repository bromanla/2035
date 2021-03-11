// Middleware secure method
module.exports.accessControl =  async (req, res, next) => {
    if (req.jwt.role === 'moderator' || req.jwt.role === 'admin')
        return next()

    res.status(403).json({ error: {msg: 'No access rights to the method'}})
    logger.trace(`User #${req.jwt.id} is trying to access a protected method`)
}
