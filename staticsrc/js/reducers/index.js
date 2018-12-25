import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import metadata from './metadata';
import pages from './pages';
import currentPage from './currentpage';
import answers from './answers';
import variables from './variables';
import messages from './messages';
import saveUrl from './saveurl';
import respondent from './respondent';
import isNew from './isnew';
import {loadingStatus} from './loading';
import surveyValidatorReducer from './validatesurvey';

/**
 * The set of reducers
 */

// All the reducers
export default (history) => combineReducers({
  router: connectRouter(history),
  metadata, 
  pages, 
  currentPage, 
  answers, 
  loadingComplete: loadingStatus,
  validatedPages: surveyValidatorReducer,
  variables,
  saveUrl,
  respondent,
  messages,
  isNew
});