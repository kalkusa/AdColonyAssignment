
/**
 * App Exception
 */
export default class AppException extends Error {
    /**
     * @param {String} message public error message
     * @param {String} debug debug info
     */
    constructor(message, debug = '') {
        super(message || 'Internal Error');
        this.name = this.constructor.name;
        this.debug = debug;
        this.isError = true;
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Returns Promise.reject() with itself
     * @returns {Promise}
     */
    reject() {
        return Promise.reject(this); // eslint-disable-line prefer-promise-reject-errors
    }

    /**
     * Response code
     * @type Integer
     * @readonly
     */
    get responseCode() {
        return (
            this.code 
            || (
                this.isError
                    ? 500
                    : 200
            )
        );
    }

    /**
     * Response data
     * @type Object
     * @readonly
     */
    get responseData() {
        return (this.data || {});
    }

    /**
     * Response Object
     * @type Object
     * @readonly
     */
    get response() {
        return {
            code: this.responseCode,
            message: this.message,
            data: this.responseData
        };
    }

    /**
     * Create new AppException instance and reject promise with it
     * @param  {...any} args 
     */
    static reject(...args) {
        return (new this(...args)).reject();
    }

    /**
     * Converts any error into AppException
     * In case of AppException instance passed to this method - it'll be returned without changes
     * @param {Error} err 
     * @param {String} message public error message
     */
    static fromError(err, message = 'Unexpected application error') {
        if (err instanceof AppException) {
            return err;
        }
        return (new this(message, err.stack));
    }

    /**
     * Converts any error into AppException and rejects promise with it
     * @param {Error} err 
     * @param {String} message public error message
     */
    static rejectFromError(err, message) {
        return this.fromError(err, message).reject();
    }
}
