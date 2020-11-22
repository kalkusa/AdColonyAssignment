
import AppException from '../../../exceptions/AppException.js';

/**
 * Handles list todo request
 * @property {Server} server Server instance
 * @property {Request} req request object
 * @property {Response} res response object
 * @returns {Promise<Object|String>}
 */
export default function todoListHandler() {
    return AppException.reject('Internal error', 'Listing todos not implemented');
}


