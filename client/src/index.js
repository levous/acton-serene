import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// Import Main styles for this application
import './scss/style.scss'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
