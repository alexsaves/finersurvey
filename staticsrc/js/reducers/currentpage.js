import {NEXT_PAGE, PREV_PAGE, JUMP_TO_PAGE} from '../actions';

// Handles actions
function currentPage(state = {}, action) {
  switch (action.type) {
    case JUMP_TO_PAGE:
      return action.pg;
    case NEXT_PAGE:
      return state + 1;
    case PREV_PAGE:
      return state - 1;
    default:
      return state
  }
}

// Modify the meta data
export default currentPage;
