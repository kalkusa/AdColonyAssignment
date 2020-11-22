This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.
Note that some scripts has been changed since project was augmented with backend server (`npm start` starts the server, `npm run start-dev` starts application in development mode).

Backend server serves productional build the react app at `/`. App in development mode is set to proxy requests to backend server (so you can do for example `fetch('/api/status')` from react app and get response from backend without referring to domain/port). If you want to change the port of backend server, remember to change `proxy` setting in `package.json` accordingly.

## Server

### Configuration

Server configuration is placed in `config/config.defaults.json`. You can add `config.local.json` to override any settings there (it'll be merged on top of defauls config):
```
{
    "db": {
        "username": "root",
        "password": "root1234"
        "database": "mydb"
    },
    "log": {
        "level": "trace"
    }
}
```

Config file can contain special values in format:
```
"<key>": { "env": "<varname>", "def": "<defaultValue>", "type": "<type>" }
```
which indicates that value should be read from `process.env[varname]`, if not preset `"def"` value would be used. Optionally you can specify `type` which can be one of: `bool`, `number`, `int` and `uint`.

### Endpoints

Endpoints are arranged in `endpoints` directory, structure is reassembling endpoints path.

Endpoints are registered in `index.js` files in each endpoint directory:
```
import status from './status.js';

export default function registerEndpoints(currentPath, server) {
    server.registerHandler('get', `${currentPath}/status`, status);
}
```

Request handler is receiving server instance, request object and response object on request. Handlers can return promise or return synchronously, in both cases return/resolve value should be one of:
 - response object `{ code: <int>, message: <String>, data: <Object> }` - all fields are optional (defaults: `{ code: 200, message: "", data: {} }`)
 - string message - results in response like `{ code: 200, message: <message>, data: {} }`
 - throw/reject with error (see `exceptions/AppException.js` for better control over errors)
 - null/undefined - in this case handler need to take care about sending out response (`res.end()` at least)

```
// result object
// sends to client:
// 200, { code: 200, message: '', data: { ... } }
export default function handler(server, req, res) {
    return server.db.models()
        .then(models => models.MyModel.findOne({ where: { id: 5 } }))
        .then(result => ({ data: result }));
}

// ------------------

// string
// send to client:
// 200, {  code: 200, message: 'OK', data: {} }
export default function handler(server, req, res) {
    return 'OK';
}

// ------------------

// error
// sends to client:
// 500, { code: 500, messsage: 'Internal Server Error', data: {} }
export default function handler(server, req, res) {
    return Promise.reject(new Error('crashed...'));
}

// ------------------

// null
// allows handler to handle response
import AppException from '../../exceptions/AppException.js';

export default function handler(server, req, res) {
    (new Promise((resolve, reject) => {
        res.sendFile('/some/file', err => (
            err
                ? reject(err)
                : resolve(null)
        ));
    }))
        .catch((e) => {
            const err = AppException.fromError(e);
            if (err.debug) {
                server.log.debug(err.debug);
            }
            res.json(err.response);
        });
    return null;
}
```

### Database Access

Database object is accessible through server instance and it has three methods:
 - connection() -> Promise<Sequelize> - returns Sequelize object
 - models() -> Promise<Object> - models dictionary
 - close() -> Promise<Void> - close connection


```
export default function handler(req, res, server) {
    return server.db.models()
        .then(models => models.MyModel.find(/* .... */))
        // ...
}
```


## Available Scripts

In the project directory, you can run:

### `npm start`

Starts the backend server.

### `npm run start-dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
App is set to proxy requests to backend server (see `proxy` field in the `package.json`), so make sure that server is running as well (`npm start`).

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
