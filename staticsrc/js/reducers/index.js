import { combineReducers, applyMiddleware } from 'redux'
import metadata from './metadata'
import pages from './pages'
import { routerReducer } from 'react-router-redux'

/**
 * The set of reducers
 */
const surveyReducers = combineReducers({
  metadata,
  pages,
  currentPage: pages
});

export default surveyReducers;
