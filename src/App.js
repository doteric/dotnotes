import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import CategoryCreation from './pages/CategoryCreation';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/catcreation" component={CategoryCreation}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
