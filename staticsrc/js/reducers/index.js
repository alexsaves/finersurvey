import {combineReducers, applyMiddleware} from 'redux';
import metadata from './metadata';
import pages from './pages';
import currentPage from './currentpage';
import answers from './answers';
import {loadingStatus} from './loading';
import {routerReducer} from 'react-router-redux';

/**
 * The set of reducers
 */
const surveyReducers = combineReducers({
  metadata, 
  pages, 
  currentPage, 
  answers, 
  loadingComplete: loadingStatus
});

// Export it
export default surveyReducers;
