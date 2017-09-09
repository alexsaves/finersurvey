import {CHANGE_ANSWER, validateSurvey} from '../actions';

// Handles actions
function answers(state = {}, action) {
  var tmp,
    answer = {};    
  switch (action.type) {
    case CHANGE_ANSWER:
      answer[action.questionName] = action.answerState;
      tmp = Object.assign({}, state, answer);
      return tmp;
    default:
      return state;
  }
}

// Modify the meta data
export default answers;
