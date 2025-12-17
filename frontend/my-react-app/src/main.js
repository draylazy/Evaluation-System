import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import './styles/globals.css';

const container = document.getElementById('app');

if (container) {
  ReactDOM.createRoot(container).render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(App, null),
    ),
  );
}

