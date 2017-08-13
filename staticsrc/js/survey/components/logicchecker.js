/**
 * Show Logic Evaluator
 */
export default class {
  /**
   * Set up a new evaluator
   */
  constructor() {}

  /**
   * Validate the results of a question
   * @param {*} question
   * @param {*} answer
   */
  checkAllLogic(showIfBlock, answers, surveyDef) {
    if (showIfBlock) {
      if (showIfBlock instanceof String) {
        return this._checkIndividualLogicRule(showIfBlock, answers, surveyDef);
      } else if (showIfBlock instanceof Array) {
        for (let i = 0; i < showIfBlock.length; i++) {
          let res = this.checkAllLogic(showIfBlock, answers, surveyDef);
          if (!res) {
            return false;
          }
        }
        return true;
      } else if (showIfBlock instanceof Object) {
        for (let i = 0; i < showIfBlock.length; i++) {
          let res = this.checkAllLogic(showIfBlock, answers, surveyDef);
          if (res) {
            return true;
          }
        }
        return false;
      }
    } else {
      // There are no conditions, so it passes
      return true;
    }
  }

  /**
   * Get a question object from a name
   * @param {*} name
   * @param {*} surveyDef
   * @private
   */
  _locateQuestionObjectForName(name, surveyDef) {}


  /**
   * Get an answer object from a name
   * @param {*} name
   * @param {*} surveyDef
   * @private
   */
  _locateAnswerObjectForName(name, surveyDef) {}

  /**
   * Evaluate a specific rule
   * @param {*} logicRule
   * @param {*} answers
   * @param {*} surveyDef
   * @private
   */
  _checkIndividualLogicRule(logicRule, answers, surveyDef) {
    if (!logicRule) {
      throw new Error("Missing logic rule.");
    }
    if (logicRule.trim().length < 3 || logicRule.indexOf('=') == -1) {
      throw new Error("Invalid logic rule: " + logicRule);
    }
    if (!answers) {
      throw new Error("Missing answers object.");
    }
    if (!surveyDef) {
      throw new Error("Missing survey definition.");
    }
    let ruleBits = logicRule.split('='),
      dependentQuestionName = ruleBits[0].trim(),
      ruleStr = ruleBits[1].trim();

    if (!dependentQuestionName || dependentQuestionName.length < 1) {
      throw new Error("Invalid question name: " + dependentQuestionName);
    }

    if (ruleStr.length < 1) {
      throw new Error("Invalid logic rule: " + ruleStr);
    }

    let dependentQuestion = this._locateQuestionObjectForName(dependentQuestionName, surveyDef);

    if (!dependentQuestion) {
      throw new Error("Could not find question for logic rule. Question name was: " + dependentQuestionName);
    } else {
      let answerObject = this._locateAnswerObjectForName(dependentQuestionName);
      console.log("About to evaluate:", ruleStr, "for question", dependentQuestion, "with answer", answerObject);
      return;
      switch (dependentQuestion.type) {
        case "rating":
          // Simple rating

          break;
        case "checkbox":
          
          break;
        case "radio":

          break;
        case "text":
          break;
        case "dropdown":
          break;
        case "matrixrating":
          break;
        case "sort":
          break;
        default:
          return false;
      }
    }
  }

};