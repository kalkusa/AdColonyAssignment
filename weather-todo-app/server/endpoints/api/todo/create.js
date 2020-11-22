
import AppException from '../../../exceptions/AppException.js';

/**
 * Handles create todo request
 * @property {Server} server Server instance
 * @property {Request} req request object
 * @property {Response} res response object
 * @returns {Promise<Object|String>}
 */
export default function todoCreateHandler() {
    return AppException.reject('Internal error', 'Creating todos not implemented');
}


