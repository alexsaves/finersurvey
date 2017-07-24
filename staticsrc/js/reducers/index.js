import { combineReducers, applyMiddleware } from 'redux'
import metadata from './metadata'
import pages from './pages'
import answers from './answers'
import { routerReducer } from 'react-router-redux'

/**
 * The set of reducers
 */
const surveyReducers = combineReducers({
  metadata,
  pages,
  currentPage: pages,
  answers
});

// Export it
export default surveyReducers;
