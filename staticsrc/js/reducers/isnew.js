import {CHANGE_NEW_STATUS} from '../actions';

// Handles actions
function isnew(state = [], action) {  
  switch (action.type) {
    case CHANGE_NEW_STATUS:
      return !!action.isNew;
    default:
      return state
  }
}

// Modify the messages object
export default isnew;
