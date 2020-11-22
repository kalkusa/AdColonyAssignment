

/**
 * Handles list todo request
 * @property {Server} server Server instance
 * @property {Request} req request object
 * @property {Response} res response object
 * @returns {Promise<Object|String>}
 */
// export default function todoListHandler() {
//     return AppException.reject('Internal error', 'Listing todos not implemented');
// }

export default function todoListHandler(server, req, res) {
    return server.db.models()
        .then(models => models.Todo.findAll())
        .then(result => ({ data: result }));
}


