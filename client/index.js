import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from "react-router";
import App from './App';
import Login from './components/Login/Login';
import Home from './components/Home/Home';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
    </Route>
  </Router>,
  document.getElementById('root')
);
