import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from './service-availability-slice.js';
import DisplayStatus from './DisplayStatus.js';

import styles from './ServiceAvailability.module.css';




export default function Counter() {
    const status = useSelector(selectStatus);
    return (
        <div className={styles.container}><DisplayStatus status={status} /></div>
    );
}
