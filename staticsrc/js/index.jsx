import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import Application from './application.jsx';
import {ConnectedRouter, routerMiddleware, push} from 'react-router-redux';
import reducers from './reducers';
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk'

// The apps initial state
const initialState = {};

// Create a Redux store holding the state of your app. Its API is { subscribe,
// dispatch, getState }.
let stateElm = document.querySelector('[type=\'finer/state\']'),
  startupState = {};
if (stateElm) {
  let stateRaw = document
    .querySelector('[type=\'finer/state\']')
    .innerText;
  if (stateRaw && stateRaw.length > 10) {
    startupState = JSON.parse(atob(document.querySelector('[type=\'finer/state\']').innerText));
  }
}

// Set up a history object
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
let appStore = createStore(reducers, startupState, applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)));
let unsubscribe = appStore.subscribe(() => console.log("STATE CHANGED", appStore.getState()));
// appStore.dispatch(modifyUser({displayName: 'Jason Smith'}));
// console.log(appStore.getState()) appStore.subscribe(() =>
// console.log(store.getState())) The only way to mutate the internal state is
// to dispatch an action. The actions can be serialized, logged or stored and
// later replayed. appStore.dispatch({type: 'INCREMENT'}) Bind the app to the
// DOM node with the app class on it
var rootNode = document.querySelector('.app');

if (rootNode) {
  render(
    <Provider store={appStore}>
    <ConnectedRouter history={history}>
      <Application/>
    </ConnectedRouter>
  </Provider>, rootNode);
}