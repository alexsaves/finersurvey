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
    //console.log(question, answer);
    // Switch based on question type
    switch (question.type) {
      case "rating":
        // Simple rating
        return (answer && !isNaN(answer));        
      case "checkbox":
        if (answer) {
          let totalAnswers = answer.responses.length;
          if (answer.other) {
            totalAnswers++;
          }
          if (totalAnswers > 0) {
            let didPass = true;
            if (question.maxanswers && totalAnswers > question.maxanswers) {
              didPass = false;
            } else if (question.minanswers && totalAnswers < question.minanswers) {
              didPass = false;
            }
            return didPass;
          } else {
            return false;
          }
        } else {
          return false;
        }
      case "radio":
        return answer && (answer.other || typeof answer.response != "undefined");
      case "text":        
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