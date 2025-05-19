import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+
import { HashRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);