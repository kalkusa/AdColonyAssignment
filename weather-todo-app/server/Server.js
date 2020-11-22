

import _ from 'lodash';
import express from 'express';
import path from 'path';
import logger from 'log4js';

import AppException from './exceptions/AppException.js';
import ROOT_DIR from './root-dir.cjs';
import initEndpoints from './endpoints/index.js';
import DB from './db/DB.js';

const reqLog = logger.getLogger('Request');

/**
 * Server
 */
export default class Server {
    /**
     * @param {Cofig} config application config
     */
    constructor(config) {
        /**
         * Application config
         * @type Config
         * @name Server#config
         */
        this.config = config;

        /**
         * Application log instance
         * @type log4js.Logger
         * @name Server#log
         */
        this.log = logger.getLogger('App');

        /**
         * DB
         * @type DB
         * @name Server#db
         */
        this.db = new DB(this.config.get('db'));
    }

    /**
     * Register request handler
     * 
     * Handler is wrapped in Promise and try/catch so any failures should be handled.
     * Handlers response is used to send response to client.
     * 
     * Handlers can resolve with String, Object or null.
     * From string response with message is created.
     * Objects are merged into default response and sent to client.
     * In case of null response handling is on handler side.
     * 
     * ```
     * (server: Server, req: Request, res: Response) -> Promise
     * ```
     * 
     * @param {String} method HTTP method
     * @param {String|RegExp} urlpath url path matcher
     * @param {Function} handler request handler
     */
    registerHandler(method, urlpath, handler) {
        this.log.trace(`Registering ${method} handler for ${urlpath}`);
        this.express[method](urlpath, (req, res, ...args) => {
            (new Promise((resolve, reject) => {
                try {
                    resolve(handler(this, req, res, ...args));
                } catch (e) {
                    reject(e);
                }
            }))
                .catch(e => AppException.rejectFromError(e))
                .catch((e) => {
                    if (e.debug) {
                        this.log.debug(e.debug);
                    }
                    return e.response;
                })
                .then((response) => {
                    if (_.isNil(response) || _.isPlainObject(response)) {
                        return response;
                    }
                    if (_.isString(response)) {
                        return { message: response };
                    }
                    this.log.warn(`Can't understand the response: ${response}`);
                    return {
                        code: 500,
                        message: 'Internal server error'
                    };
                })
                .then((response) => {
                    if (response) {
                        const message = {
                            code: 200,
                            message: '',
                            data: {},
                            ...response
                        };
                        reqLog.trace(`${req.method} ${req.path} ${req.ip} -> ${message.code}`);
                        if (res.headersSent) {
                            reqLog.warn(`Can't deliver response, headers already sent (${JSON.stringify(response)})`);
                            return;
                        }
                        const { code } = message;
                        res.statusCode = code;
                        res.json(message);
                    }
                });
        });
    }

    /**
     * Starts the server
     */
    start() {
        return Promise.resolve()
            .then(() => {
                this.express = express();
                return this.__installMiddleware();
            })
            .then(() => initEndpoints('', this))
            .then(() => this.__startListening());
    }

    /**
     * Start listening
     */
    __startListening() {
        const port = this.config.get('server.port', 3000);
        this.express.listen(port, () => {
            this.log.info(`Listening on ${port}`);
        });
    }

    /**
     * Installs middleware
     */
    __installMiddleware() {
        this.express.use((req, res, next) => {
            reqLog.debug(`${req.method} ${req.path} ${req.ip}`);
            next();
        });
        this.express.use(express.static(path.join(ROOT_DIR, 'public')));
    }

    /**
     * Create new instance of server and start it
     * @param {Config} config 
     * @returns {Promise}
     */
    static start(config) {
        return (new this(config)).start();
    }
}

