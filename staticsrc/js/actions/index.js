/*
 * Action types
 */
export const MODIFY_METADATA = 'MODIFY_METADATA';
export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';

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
