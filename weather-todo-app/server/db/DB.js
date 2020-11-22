
import Sequelize from 'sequelize';
import logger from 'log4js';

import initModels from './models/index.js';


/**
 * DB Connection
 */
export default class DB {
    /**
     * @param {Object} config Sequelize config object
     */
    constructor(config) {
        this.log = logger.getLogger('DB');
        this.config = config;
    }

    /**
     * Creates new instance of Sequelize or returns existing one
     * @param {Boolean} nocreate whenever new connection should not be initialized, defaults to `false` (eg. for closing existing connection)
     * @returns {Promise<Sequelize>}
     */
    connection(nocreate = false) {
        if (this.__connection) {
            return Promise.resolve(this.__connection);
        }
        if (!this.__connecting) {
            if (nocreate) {
                this.log.trace('nocreate = true, no connection, returning null');
                return Promise.resolve(null);
            }
            this.log.trace('starting new connection', this.config);
            this.__connecting = (new Promise((resolve, reject) => {
                const connection = new Sequelize(this.config);
                connection.authenticate()
                    .then(() => resolve(connection))
                    .catch(reject);
            }))
                .then((connection) => {
                    this.log.trace('initializing models');
                    initModels(connection);
                    this.__connecting = null;
                    this.__connection = connection;
                    return connection;
                })
                .catch((e) => {
                    this.__connecting = null;
                    return Promise.reject(e);
                });
        }
        return this.__connecting;
    }

    /**
     * Fetch models dictionary
     * If connection is not initialized yet, this method will connect to DB first
     * @returns {Promise<Object>}
     */
    models() {
        return this.connection()
            .then(connection => connection.models);
    }

    /**
     * Closes connection
     * This method always resolves
     * @returns {Promise<Void>}
     */
    close() {
        return this.connection(true)
            .then((connection) => {
                this.__connection = null;
                return connection.close();
            })
            .catch((e) => {
                this.log.debug(`Error closing DB connection: ${e.message}\n${e.stack}`);
            });
    }
}


