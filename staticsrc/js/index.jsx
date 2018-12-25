import React from 'react';
import { render } from 'react-dom';
import Survey from './survey/survey.jsx';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import debounce from 'debounce';

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
      startupState.isNew = !localStorage.getItem("_" + startupState.metadata.guid);
    }
    localStorage.setItem("_" + startupState.metadata.guid, (new Date()).getTime().toString());
    startupState.messages = Object.assign({}, MESSAGES, startupState.messages);
    let existingAnsOnObject = JSON.stringify(startupState.answers);
    if (existingAnsOnObject && existingAnsOnObject.length > 1 && existingAnsOnObject != "{}") {
      //console.log("OVERWRITING WITH", startupState.answers);
      localStorage.setItem(persistentKey, JSON.stringify({ key: persistentKey, hash: surveyHash, answers: startupState.answers }));
    }
    if (ansObj.key == persistentKey && ansObj.hash == surveyHash && (!existingAnsOnObject || existingAnsOnObject == '{}')) {
      //console.log("Writing to ", ansObj.answers);
      startupState.answers = ansObj.answers;
    }
  }
}


//var __lastAnsState;


import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import thunk from 'redux-thunk';

const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history), // root reducer with router state
  startupState,
  compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      thunk
    ),
  ),
);
// TODO RECONCILS
// Build the middleware for intercepting and dispatching navigation actions

store.subscribe(() => {
  let st = store.getState(),
    ansState = {
      key: persistentKey,
      hash: surveyHash,
      answers: st.answers || {}
    },
    ansStateStr = JSON.stringify(ansState);
  localStorage.setItem(persistentKey, ansStateStr);
});

// console.log(appStore.getState()) appStore.subscribe(() =>
// console.log(store.getState())) The only way to mutate the internal state is
// to dispatch an action. The actions can be serialized, logged or stored and
// later replayed. appStore.dispatch({type: 'INCREMENT'}) Bind the app to the
// DOM node with the app class on it
var rootNode = document.querySelector('.app');

// Only worry about viewport height if its the facebook messenger app Detect FB
// based on UA
function ___isFacebookApp() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}
function ___fixViewportHeight() {
  var html = document.querySelector('html');
  function _onResize() {
    html.style.height = window.innerHeight + 'px';
  }
  window.addEventListener('resize', debounce(_onResize, 125));
  _onResize();
}
if (___isFacebookApp()) {
  // Start fixing
  ___fixViewportHeight();
}

// Proceed if we find the root node
if (rootNode) {
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Survey />
      </ConnectedRouter>
    </Provider>, rootNode);
}