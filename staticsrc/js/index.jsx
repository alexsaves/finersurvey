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

// Provides default application messages
const MESSAGES = {
  prevPage: "Previous page",
  nextPage: "Next page",
  reqQuestion: "This question is required.",
  pageNotFound: "That page was not found.",
  startOver: "Don't worry. We'll return you to the beginning of the survey.",
  ok: "OK",
  requiredQ: "This question is required",
  winLossAnalysis: "Sales Win/Loss Analysis"
};

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
    for (let b = 0; b < startupState.pages.length; b++) {
      if (typeof startupState.pages[b].isStartable == "undefined") {
        startupState.pages[b].isStartable = (b == 0);
      }
      for (let k = 0; k < startupState.pages[b].elements.length; k++) {
        let elm = startupState.pages[b].elements[k];
        if (typeof elm.name == "undefined") {
          elm.name = "unnamed_" + elm.type + "_" + b + "_" + k;
        }
      }
    }
    startupState.validatedPages = JSON.parse(JSON.stringify(startupState.pages));
    if (startupState.metadata) {
      surveyHash = startupState.metadata.guid + "_" + startupState.respondent;
      persistentKey += "_" + startupState.metadata.guid;
    }
    let oldAnswers = localStorage.getItem(persistentKey),
      ansObj = {};
    if (oldAnswers) {
      ansObj = JSON.parse(oldAnswers);
    }
    if (typeof startupState.isNew == "undefined") {
      startupState.isNew = !!!localStorage.getItem("_" + startupState.metadata.guid);
    }
    localStorage.setItem("_" + startupState.metadata.guid, (new Date()).getTime().toString());
    startupState.messages = Object.assign({}, MESSAGES, startupState.messages);
    let existingAnsOnObject = JSON.stringify(startupState.answers);
    if (existingAnsOnObject && existingAnsOnObject.length > 1 && existingAnsOnObject != "{}") {
      //console.log("OVERWRITING WITH", startupState.answers);
      localStorage.setItem(persistentKey, JSON.stringify({key: persistentKey, hash: surveyHash, answers: startupState.answers}));
    }
    if (ansObj.key == persistentKey && ansObj.hash == surveyHash && (!existingAnsOnObject || existingAnsOnObject == '{}')) {
      //console.log("Writing to ", ansObj.answers);
      startupState.answers = ansObj.answers;
    }
  }
}

// Set up a history object
const history = createHistory();

var __lastAnsState;

// Build the middleware for intercepting and dispatching navigation actions
let appStore = createStore(reducers, startupState, applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)));
let unsubscribe = appStore.subscribe(() => {
  let st = appStore.getState(),
    ansState = {
      key: persistentKey,
      hash: surveyHash,
      answers: st.answers || {}
    },
    ansStateStr = JSON.stringify(ansState);
  if (ansStateStr != __lastAnsState && !st.isNew) {
    __lastAnsState = ansStateStr;
    localStorage.setItem(persistentKey, ansStateStr);
  }
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