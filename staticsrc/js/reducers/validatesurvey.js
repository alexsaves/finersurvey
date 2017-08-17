import {VALIDATE_SURVEY} from '../actions';
import clone from '../survey/components/clone';
import LogicChecker from '../survey/components/logicchecker';

// Does validation
function surveyValidatorReducer(state = [], action) {
  switch (action.type) {
    case VALIDATE_SURVEY:
      let answers = action.answers,
        pages = clone(action.pages),
        checker = new LogicChecker(),
        questionCount = 0;

      for (let i = 0; i < pages.length; i++) {
        let pg = pages[i],
          els = pg.elements;
        pg.isValid = checker.checkAllLogic(pg.showIf, answers, pages);
        if (els) {
          for (let j = 0; j < els.length; j++) {
            let q = els[j];
            if (q.showIf) {
              q.isValid = checker.checkAllLogic(q.showIf, answers, pages);
              if (!q.isValid) {
                els.splice(j--, 1);
              }
            } else {
              q.isValid = true;
            }
          }
        }
        if (!els || els.length == 0) {
          pages.splice(i--, 1);
        }
      }

      // Count the questions
      for (let i = 0; i < pages.length; i++) {
        let pg = pages[i],
          els = pg.elements;
        if (els) {
          for (let j = 0; j < els.length; j++) {
            let q = els[j];
            if (q.displayNumber) {
              q.questionNumber = ++questionCount;
            }
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
