import React from 'react';
import ReactDOM from 'react-dom';
import CustomRouter from './router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<CustomRouter />, document.getElementById('root'));
registerServiceWorker();
