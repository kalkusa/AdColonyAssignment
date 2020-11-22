
import status from './status.js';
import todosRegister from './todo/index.js';

/**
 * Registers API request handlers
 * @param {String} path current url path
 * @param {Server} server server instance
 */
export default function registerApi(path, server) {
    // register underlaying paths first
    todosRegister(`${path}/todo`, server);
    
    server.registerHandler('get', `${path}/status`, status);
}

