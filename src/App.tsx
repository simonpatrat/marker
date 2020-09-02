import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Home } from './components/Home';
import { UpdateLinkForm } from './components/UpdateLinkForm';

import 'semantic-ui-css/semantic.min.css';
import './App.scss';

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="container">
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/bookmark/:id">
            <UpdateLinkForm />
          </Route>
          <Route path="*">
            <h1>404 - Not found</h1>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
