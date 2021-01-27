module.exports = [
    // Page not Found
    (req, res) => {
        res.status(404).json({
            error: {
                msg: 'Method doesn\'t exist'
            }
        })
    },
    // Error handler
    (err, req, res, next) => {
        let code = 500,
            message = 'The server cannot handle the error';

        switch (err.name) {
            case 'SyntaxError':
                code = 401;
                message = 'Unexpected string in JSON'
                break;
            case 'UnauthorizedError':
                code = 422
                message = err.message
                break;
            default:
                logger.error(`Unidentified Express error: ${err}`);
                break;
        }

        return res.status(code).json({
            error: {
                msg: message
            }
        })
    }
]