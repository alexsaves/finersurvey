import {combineReducers, applyMiddleware} from 'redux';
import metadata from './metadata';
import pages from './pages';
import currentPage from './currentpage';
import answers from './answers';
import variables from './variables';
import saveUrl from './saveurl';
import {loadingStatus} from './loading';
import surveyValidatorReducer from './validatesurvey';
import {routerReducer} from 'react-router-redux';

/**
 * The set of reducers
 */
const surveyReducers = combineReducers({
  metadata, 
  pages, 
  currentPage, 
  answers, 
  loadingComplete: loadingStatus,
  validatedPages: surveyValidatorReducer,
  variables,
  saveUrl
});

// Export it
export default surveyReducers;
