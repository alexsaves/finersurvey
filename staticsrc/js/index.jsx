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
  startupState = {},
  persistentKey = "survey_answers",
  surveyHash = '';
if (stateElm) {
  let stateRaw = document
    .querySelector('[type=\'finer/state\']')
    .innerText;
  if (stateRaw && stateRaw.length > 5) {
    let rawStateDataStr = document
      .querySelector('[type=\'finer/state\']')
      .innerText;
    startupState = JSON.parse(atob(rawStateDataStr));
    if (startupState.metadata) {
      surveyHash = startupState.metadata.guid + "_" + rawStateDataStr.length;
      persistentKey += "_" + startupState.metadata.guid;
    }
    let oldAnswers = localStorage.getItem(persistentKey),
      ansObj = {};
    if (oldAnswers) {
      ansObj = JSON.parse(oldAnswers);
    }
    
    let existingAnsOnObject = JSON.stringify(startupState.answers);
    if (existingAnsOnObject && existingAnsOnObject.length > 1 && existingAnsOnObject != "{}") {
      localStorage.setItem(persistentKey, JSON.stringify({
        key: persistentKey,
        hash: surveyHash,
        answers: startupState.answers
      }));
    }
    if (ansObj.key == persistentKey && ansObj.hash == surveyHash && (!existingAnsOnObject || existingAnsOnObject == '{}')) {
      startupState.answers = ansObj.answers;
    }
  }
}

// Set up a history object
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
let appStore = createStore(reducers, startupState, applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)));
let unsubscribe = appStore.subscribe(() => {
  let st = appStore.getState();
  localStorage.setItem(persistentKey, JSON.stringify({
    key: persistentKey,
    hash: surveyHash,
    answers: st.answers || {}
  }));
  //console.log("STATE CHANGED", appStore.getState())
});

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