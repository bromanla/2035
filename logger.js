/**
* Logs level
* fatal
* error:   0
* warn:    1
* info:    2
* debug:   3
* trace:   4
**/

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
        },
        telegram: {
            type: 'log4js-telegram-appender',
            silentAlertLevel: 'warn',
            audioAlertLevel: 'error',
            bottoken: process.env.TELEGRAM_TOKEN,
            botchatid: process.env.TELEGRAM_CHATID
        }
    },
    categories: {
        default: {
            appenders: ['stdout', 'telegram'],
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        }
    }
})

const logger = log4js.getLogger('2035');

global.logger = logger;