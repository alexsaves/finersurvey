/*
 * Action types
 */
export const MODIFY_METADATA = 'MODIFY_METADATA';

/*
 * Modify meta-data
 */
export function modifyMetaData(attrObj) {
  return {type: MODIFY_METADATA, attrObj};
};
