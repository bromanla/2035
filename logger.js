const log4js = require('log4js');

log4js.configure({
    appenders: {
        stdout: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}] [%p] %c%]%x{error}%m',
                tokens: {
                    error: (options) => {
                        return options.level.level >= 30000 ? '\n' : ' - '
                    }
                }
            }
        }
    },
    categories:{
        default: {
            appenders: ['stdout'],
            level: 'trace'
        }
    }
})

const logger = log4js.getLogger('2035');

global.logger = logger;
