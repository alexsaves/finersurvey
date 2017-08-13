import {VALIDATE_SURVEY} from '../actions';
import clone from '../survey/components/clone';
import LogicChecker from '../survey/components/logicchecker';

// Does validation
function surveyValidatorReducer(state = [], action) {
  switch (action.type) {
    case VALIDATE_SURVEY:
      let answers = action.answers,
        pages = clone(action.pages),
        checker = new LogicChecker();
      for (let i = 0; i < pages.length; i++) {
        let pg = pages[i],
          els = pg.elements;
        pg.isValid = checker.checkAllLogic(pg.showIf, answers, pages);
        if (els) {
          for (let j = 0; j < els.length; j++) {
            let q = els[j];
            q.isValid = checker.checkAllLogic(q.showIf, answers, pages);
          }
        }
      }
      return pages;
    default:
      return state
  }
}

// Modify the meta data
export default surveyValidatorReducer;
