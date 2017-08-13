/*
 * Action types
 */
export const MODIFY_METADATA = 'MODIFY_METADATA';
export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';
export const JUMP_TO_PAGE = 'JUMP_TO_PAGE';
export const CHANGE_ANSWER = 'CHANGE_ANSWER';
export const LOADING_SCREEN_REMOVE = 'LOADING_SCREEN_REMOVE';

/**
 * Change or add an answer
 * @param {*} questionName 
 * @param {*} answerState 
 */
export function changeAnswer(questionName, answerState) {
  return {type: CHANGE_ANSWER, questionName, answerState};
};

/*
 * Modify meta-data
 */
export function modifyMetaData(attrObj) {
  return {type: MODIFY_METADATA, attrObj};
};

/*
 * Next page
 */
export function nextPage() {
  return {type: NEXT_PAGE};
};

/*
 * Prev page
 */
export function prevPage() {
  return {type: PREV_PAGE};
};

/*
 * Jump to a page
 */
export function jumpToPage(pg) {
  return {type: JUMP_TO_PAGE, pg};
};

/*
 * Remove a loading screen
 */
export function removeTheLoadingScreen() {
  return {type: LOADING_SCREEN_REMOVE};
};
