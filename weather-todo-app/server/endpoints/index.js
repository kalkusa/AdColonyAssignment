
import path from 'path';
import ROOT_DIR from '../root-dir.cjs';

import api from './api/index.js';

/**
 * Handles `/` request
 * @property {Server} server Server instance
 * @property {Request} req request object
 * @property {Response} res response object
 * @returns {null}
 */
export function indexHandler(_, __, res) {
    return (new Promise((resolve, reject) => {
        res.sendFile(path.join(ROOT_DIR, 'public', 'index.html'), err => (
            err
                ? reject(err)
                : resolve(null) // return null, response already sent
        ));
    }));
}

/**
 * Registers top level request handlers
 * @param {String} path current url path
 * @param {Server} server server instance
 */
export default function registerEndpoints(urlpath = '', server) {
    // register underlaying paths first
    api(`${urlpath}/api`, server);

    server.registerHandler('get', `${urlpath}/`, indexHandler);

    // 404 handler
    server.registerHandler('all', '*', () => ({ code: 404, message: 'Not found' })); // handle not found
}
