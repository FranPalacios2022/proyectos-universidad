import React from 'react';
import ReactDOM from 'react-dom/client';
// ✅ DADO: Bootstrap se importa UNA sola vez, acá en el entrypoint.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
