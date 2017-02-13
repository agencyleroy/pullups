import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import App from './components/App';
import appReducer from './reducers';
import { api } from './lib/api';
import _ from 'lodash';
import queryString from 'query-string';


// REDUX
import { addEntry, fetchEntries, signOut, signIn, confirmSignIn } from './actions';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers({app: appReducer, routing: routerReducer}), composeEnhancers(
  applyMiddleware(thunk)
));

// AUTH
api.on('unauthorized', () => {
  //store.dispatch(signOut());
});

console.log(createHistory);
const history = syncHistoryWithStore(createHistory(), store);

const parsed = queryString.parse(location.search);
const queryToken = _.has(parsed, 'token') ? parsed.token : null;
const storedToken = window.sessionStorage.getItem('token');
const token = queryToken || storedToken;
store.dispatch(signIn(token));

store.dispatch(fetchEntries());

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App} />
      </Router>
    </Provider>
  ), document.getElementById('container'));
});
