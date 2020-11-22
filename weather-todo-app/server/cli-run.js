
import logger from 'log4js';
import path from 'path';

import ROOT_DIR from './root-dir.cjs';
import Config from './Config.js';
import Server from './Server.js';
import AppException from './exceptions/AppException.js';


// load configs
Config.load([
    path.join(ROOT_DIR, 'config', 'config.defaults.json'),
    path.join(ROOT_DIR, 'config', 'config.local.json')
])
    .then((config) => {
        // configure logging
        logger.configure({
            appenders: { console: { type: 'console' } },
            categories: { default: { appenders: ['console'], level: config.get('log.level', 'warn') } }
        });
        // start server
        return Server.start(config);
    })
    .catch((e) => {
        const err = AppException.fromError(e);
        const log = logger.getLogger('App');
        if (err.debug) {
            log.debug(err.debug);
        }
        log.fatal(err.message);
        process.exit(1);
    });

