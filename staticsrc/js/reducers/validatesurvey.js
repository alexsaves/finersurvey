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

      // Do another pass on question numbering and special cases for required
      for (let i = 0; i < pages.length; i++) {
        let pg = pages[i],
          els = pg.elements;
        if (els) {
          for (let j = 0; j < els.length; j++) {
            let q = els[j];
            if (q.displayNumber) {
              q.questionNumber = ++questionCount;
            }
            if (q.modifier) {
              q.modifier = q.modifier.trim().toLowerCase();
            }
            if (q.type == "text") {
              if (typeof q.wordcountlabel == 'undefined') {
                q.wordcountlabel = "Words";
              }
              if (typeof q.wordcountmaxlabel == 'undefined') {
                q.wordcountmaxlabel = "Words left";
              }
              if (q.limits) {
                if ((q.limits.word && q.limits.word.min) || (q.limits.character && q.limits.character.min)) {
                  q.required = true;
                }
              }              
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
