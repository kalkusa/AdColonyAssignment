
import listHandler from './list.js';
import createHandler from './create.js';


/**
 * Registers TODO request handlers
 * @param {String} path current url path
 * @param {Server} server server instance
 */
export default function registerTodo(path, server) {
    server.registerHandler('get', `${path}/list`, listHandler);
    server.registerHandler('post', `${path}/create`, createHandler);
}

