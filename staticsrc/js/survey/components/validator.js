/**
 * Validator
 */
export default class {
  /**
   * Set up a new validator
   */
  constructor() {}

  /**
   * Validate the results of a question
   * @param {*} question
   * @param {*} answer
   */
  validate(question, answer) {
    //console.log(question, answer); Switch based on question type
    switch (question.type) {
      case "rating":
        // Simple rating
        return (answer && !isNaN(answer));
      case "checkbox":
        if (answer && answer.responses) {
          let totalAnswers = answer.responses.length;
          if (answer.other) {
            totalAnswers++;
          }
          if (totalAnswers > 0) {
            let didPass = true;
            if (question.limits && typeof question.limits.max != 'undefined' && totalAnswers > question.limits.max) {
              didPass = false;
            } else if (question.limits && typeof question.limits.min != 'undefined' && totalAnswers < question.limits.min) {
              didPass = false;
            }
            return didPass;
          } else {
            return false;
          }
        } else {
          return false;
        }
      case "multitext":
        if (answer && answer.length > 0) {
          for (let i = 0; i < answer.length; i++) {
            let ans = answer[i];
            if (!ans || ans.trim().length == 0) {
              return false;
            }
          }
          return true;
        }
        return false;
      case "radio":
        return answer && (answer.other || typeof answer.response != "undefined");
      case "text":
        if (question.limits) {
          let lim = question.limits;
          if (lim.character) {
            if (lim.character.max && answer.length > lim.character.max) {
              return false;
            } else if (lim.character.min && answer.length < lim.character.min) {
              return false;
            }
          }
          if (lim.word) {
            let wordcount = (answer || "")
              .trim()
              .split(' ')
              .length;
            if (lim.word.max && wordcount > lim.word.max) {
              return false;
            } else if (lim.word.min && wordcount < lim.word.min) {
              return false;
            }
          }
        }
        return answer && (answer.length > 0);
      case "dropdown":
        return (typeof answer != undefined) && (answer > -1);
      case "matrixrating":
        return answer.indexOf(-1) == -1;
      case "sort":
        return answer && (answer.order && answer.order.length > 0);
      default:
        return false;
    }
  }

};