import {CHANGE_ANSWER} from '../actions';

// Handles actions
function answers(state = {}, action) {
  let tmp;  
  switch (action.type) {
    case CHANGE_ANSWER:
      console.log("ANSWERS REDUCER", state, action);
      tmp = Object.assign({}, state);
      //tmp = Object.assign(tmp, action.answerState);
      return tmp;
    default:
      return state
  }
}

// Modify the meta data
export default answers;
