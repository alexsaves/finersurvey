/**
 * Answer piping
 */
export default class {
  /**
   * Set up a new piper
   */
  constructor() {
    this.pipeMatch = /\$\{([a-zA-Z0-9_]*)\}/g;
  }

  /**
   * Get the question definition from the survey
   * @param {*} survey
   * @param {*} questionName
   */
  getQuestionDefFromSurvey(survey, questionName) {
    for (let i = 0; i < survey.length; i++) {
      for (let j = 0; j < survey[i].elements.length; j++) {
        if (survey[i].elements[j].name == questionName) {
          return survey[i].elements[j];
        }
      }
    }
  }

  /**
   * Get the question definition from the survey
   * @param {*} survey
   * @param {*} questionName
   */
  getAnswerFromKeyName(questionDef, answers, questionName) {
    debugger;
  }

  /**
   * Run piping on answers and some text
   * @param {*} text
   * @param {*} answers
   */
  pipe(text, answers, survey) {
    console.log("PIPING", text, answers, survey);
    text = text.replace(this.pipeMatch, (match, questionName, position) => {
      let q = this.getQuestionDefFromSurvey(survey, questionName);
      if (q) {
        let a = this.getAnswerFromKeyName(q, answers, questionName);
        return a || "";
      }
      return "";
    });

    return text;
  }

};