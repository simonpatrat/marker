import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { BookmarksContextProvider } from './context';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BookmarksContextProvider>
      <Router>
        <App />
      </Router>
    </BookmarksContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
