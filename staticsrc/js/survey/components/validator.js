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
    // Switch based on question type
    switch (question.type) {
      case "rating":
        // Simple rating
        return (answer && !isNaN(answer));
      default:     
        return false;
    }
  }

};