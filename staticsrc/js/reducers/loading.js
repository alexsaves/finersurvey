import {LOADING_SCREEN_REMOVE} from '../actions';

// Handles actions
export function loadingStatus(state, action) {
  switch (action.type) {
    case LOADING_SCREEN_REMOVE:
      return true;
    default:
      return false
  }
}

