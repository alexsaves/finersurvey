import {VALIDATE_SURVEY} from '../actions';
import clone from '../survey/components/clone';
import LogicChecker from '../survey/components/logicchecker';

/**
 * Validate a question name
 * @param {String} name
 */
function questionNameIsValid(name) {
  if (name && name.trim().length > 0 && name.trim().length == name.length) {
    return name.match(/[a-zA-Z_][a-zA-Z_0-9]*/gi) && !name.match(/[^a-zA-Z0-9_]/);
  }
  return false;
}

/**
 * Performs validation on the survey overall
 * @param {*} state 
 * @param {*} action 
 */
function surveyValidatorReducer(state = [], action) {
  switch (action.type) {
    case VALIDATE_SURVEY:
      let answers = action.answers,
        pages = clone(action.pages),
        variables = clone(action.variables || {}),
        checker = new LogicChecker(),
        questionCount = 0;

      for (let i = 0; i < pages.length; i++) {
        let pg = pages[i],
          els = pg.elements;

        if (typeof pg.isStartable == "undefined") {
          pg.isStartable = i == 0;
        }

        pg.isValid = checker.checkAllLogic(pg.showIf, answers, pages, variables);
        if (!pg.isValid) {
          pages.splice(i--, 1);
          continue;
        }
        if (els) {
          for (let j = 0; j < els.length; j++) {
            let q = els[j];
            if (q.showIf) {
              q.isValid = checker.checkAllLogic(q.showIf, answers, pages, variables);
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
        if (!pg.name) {
          pg.name = "__" + i;
        }
        if (!questionNameIsValid(pg.name)) {
          throw new Error("Page name is invalid: " + pg.name + " for " + JSON.stringify(pg));
        }
        if (els) {
          for (let j = 0; j < els.length; j++) {
            let q = els[j];
            if (!questionNameIsValid(q.name)) {
              throw new Error("Question name is invalid: " + q.name + " for " + JSON.stringify(q));
            }
            if (q.displayNumber) {
              q.questionNumber = ++questionCount;
            }
            if (q.modifier) {
              q.modifier = q
                .modifier
                .trim()
                .toLowerCase();
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

// Export the validation reducer to the rest of the app
export default surveyValidatorReducer;
