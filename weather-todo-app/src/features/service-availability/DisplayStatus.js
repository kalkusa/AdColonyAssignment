
import React from 'react';
import PropTypes from 'prop-types';

import styles from './ServiceAvailability.module.css';


export function statusToText(status) {
    if (status > 0) {
        return 'service available';
    }
    if (status < 0) {
        return 'service unavailable';
    }
    return 'waiting for status...';
}


export function classNameFromStatus(status) {
    if (status > 0) {
        return styles.statusOK;
    }
    if (status < 0) {
        return styles.statusError;
    }
    return styles.statusUnknown;
}

export default function DisplayStatus(props) {
    const text = statusToText(props.status);
    return (
        <span className={classNameFromStatus(props.status)}>{text}</span>
    );
}

DisplayStatus.propTypes = {
    status: PropTypes.number
};
