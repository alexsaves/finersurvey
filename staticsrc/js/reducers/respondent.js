import {CHANGE_RESPONDENT} from '../actions';

// Handles actions
function respondent(state = {}, action) {
  switch (action.type) {
    case CHANGE_RESPONDENT:
      if (action.respid) {
        return action.respid;
      } else {
        return state;
      }
    default:
      return state
  }
}

// Modify the meta data
export default respondent;
