import React from 'react';
import ReactDOM from 'react-dom';

import BrowserRouter from './BrowserRouter';

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(<BrowserRouter />, mountNode);
