
import React from 'react';
import logo from './logo.svg';
import ServiceAvailbility from './features/service-availability/ServiceAvailability.js';
import './App.css';

function App() {
    return ( 
        <div className="App">
            <header className="App-header">
                <img src={ logo }
                    className="App-logo"
                    alt="logo" />
                <ServiceAvailbility />
            </header>
            <div className="App-content">

            </div>
        </div>
    );
}

export default App;
