
import _ from 'lodash';
import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);
const readJson = (...args) => readFile(...args).then(content => JSON.parse(`${content}`));


const getNumber = (value, defaultValue = 0) => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) {
        return defaultValue;
    }
    return v;
};

const getInt = (value, defaultValue = 0) => {
    const v = parseInt(value, 10);
    if (Number.isNaN(v)) {
        return defaultValue;
    }
    return v;
};

const getUInt = (value, defaultValue = 0) => {
    const v = parseInt(value, 10);
    if (Number.isNaN(v) || v < 0) {
        return defaultValue;
    }
    return v;
};

export default class Config {
    static load(files) {
        return (new this()).load(files);
    }

    load(files) {
        return Promise.all(files.map(filepath => this.__loadConfig(filepath)))
            .then(configs => (configs.length > 1 ? _.mergeWith(...configs, (objValue, srcValue) => {
                if (_.isArray(srcValue) || _.isArray(objValue)) {
                    return srcValue;
                }
            }) : configs[0]))
            .then((config) => {
                this.options = config;
                return this;
            });
    }

    __processConfigValue(value) {
        if (_.isPlainObject(value) && value.env) {
            if (typeof (process.env[value.env]) === 'undefined') {
                return value.def;
            }
            const v = process.env[value.env];
            switch (value.type) {
                case 'bool': {
                    switch (v) {
                        case 'no':
                        case 'off':
                        case '0':
                            return false;
                        default:
                            return !!v;
                    }
                }
                case 'number':
                    return getNumber(v, value.def);
                case 'int':
                    return getInt(v, value.def);
                case 'uint':
                    return getUInt(v, value.def);
                default:
                    return v;
            }
        } else if (_.isPlainObject(value)) {
            return _.mapValues(value, innerValue => this.__processConfigValue(innerValue));
        }
        return value;
    }

    __loadConfig(filepath) {
        return (
            fs.existsSync(filepath)
                ? readJson(filepath)
                : Promise.resolve({})
        )
            .then(content => Object.keys(content).reduce((output, key) => ({
                ...output,
                [key]: this.__processConfigValue(content[key])
            }), {}));
    }

    get(...args) {
        return _.get(this.options, ...args);
    }
}

