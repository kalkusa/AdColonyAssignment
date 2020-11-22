

import { update } from './service-availability-slice.js';


export default function startChecks(store) {
    fetch('/api/status')
        .then(res => res.json())
        .then(data => (
            data && data.code === 200 && data.message === 'OK'
                ? 1
                : -1
        ))
        .catch(() => -2)
        .then((result) => {
            store.dispatch(update(result));
            if (result > 0) {
                return 5000;
            }
            return 300;
        })
        .then(delay => setTimeout(startChecks, delay, store));
}

