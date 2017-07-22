import {NEXT_PAGE, PREV_PAGE} from '../actions';

// Handles actions
function pages(state = {}, action) {
  switch (action.type) {
    case NEXT_PAGE:
      return state + 1;
      break;
    case PREV_PAGE:
      return state - 1;
      break;
    default:
      return state
  }
}

// Modify the meta data
export default pages;
