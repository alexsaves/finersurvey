/**
 * Validator
 */
export default class {
  /**
   * Set up a new validator
   */
  constructor() {
  }

  /**
   * Validate the results of a question
   * @param {*} question 
   * @param {*} answer 
   */
  validate(question, answer) {
    //console.log(question.type);
    // Switch based on question type
    switch (question.type) {
      case "rating":
        // Simple rating
        return (answer && !isNaN(answer));
      case "checkbox":
        return answer && (answer.other || answer.responses.length > 0);
      case "radio":
        return answer && (answer.other || typeof answer.response != "undefined");
      default:     
        return false;
    }
  }

};