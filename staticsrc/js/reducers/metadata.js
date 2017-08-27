import {MODIFY_METADATA} from '../actions';

// Handles actions
function metadata(state = {}, action) {
  let tmp;
  switch (action.type) {
    case MODIFY_METADATA:
      tmp = Object.assign({}, state);
      tmp = Object.assign(tmp, action.attrObj);
      return tmp;
    default:
      return state
  }
}

// Modify the meta data
export default metadata;
