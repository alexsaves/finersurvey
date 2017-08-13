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
      if (typeof showIfBlock == "string") {
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
      } else {
        throw new Error("Invalid show logic condition: " + showIfBlock);
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
  _locateQuestionObjectForName(name, surveyDef) {
    for (let i = 0; i < surveyDef.length; i++) {
      let pg = surveyDef[i];
      if (pg.elements) {
        return pg
          .elements
          .find((el) => {
            return el.name == name;
          });
      }
    }
  }

  /**
   * Get an answer object from a name
   * @param {*} name
   * @param {*} surveyDef
   * @private
   */
  _locateAnswerObjectForName(name, answerObject) {
    if (answerObject) {
      return answerObject[name];
    }
  }

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
      let answerObject = this._locateAnswerObjectForName(dependentQuestionName, answers);
      console.log("About to evaluate:", ruleStr, "for question", dependentQuestion, "with answer", answerObject);
      switch (dependentQuestion.type) {
        case "rating":
          return this._evaluateRatingLogic(dependentQuestion, answerObject, ruleStr);
        case "checkbox":
          return this._evaluateCheckboxLogic(dependentQuestion, answerObject, ruleStr);
        case "radio":
          return this._evaluateRadioLogic(dependentQuestion, answerObject, ruleStr);
        case "text":
          return this._evaluateTextLogic(dependentQuestion, answerObject, ruleStr);
        case "dropdown":
          return this._evaluateDropdownLogic(dependentQuestion, answerObject, ruleStr);
        case "matrixrating":
          return this._evaluateMatrixRatingLogic(dependentQuestion, answerObject, ruleStr);
        case "sort":
          return this._evaluateSortLogic(dependentQuestion, answerObject, ruleStr);
        default:
          return false;
      }
    }
  }

  /**
   * Evaluate the show logic for a rating question
   * @param {*} questionDef
   * @param {*} answerObj
   * @param {*} condition
   */
  _evaluateRatingLogic(questionDef, answerObj, condition)
  {}

  /**
   * Evaluate the show logic for a checkbox question
   * @param {*} questionDef
   * @param {*} answerObj
   * @param {*} condition
   */
  _evaluateCheckboxLogic(questionDef, answerObj, condition)
  {}

  /**
   * Evaluate the show logic for a radio question
   * @param {*} questionDef
   * @param {*} answerObj
   * @param {*} condition
   */
  _evaluateRadioLogic(questionDef, answerObj, condition)
  {}

  /**
   * Evaluate the show logic for a text question
   * @param {*} questionDef
   * @param {*} answerObj
   * @param {*} condition
   */
  _evaluateTextLogic(questionDef, answerObj, condition)
  {}

  /**
   * Evaluate the show logic for a dropdown question
   * @param {*} questionDef
   * @param {*} answerObj
   * @param {*} condition
   */
  _evaluateDropdownLogic(questionDef, answerObj, condition)
  {
    let conditionChoice = parseInt(condition);
    if (isNaN(conditionChoice)) {
      throw new Error("Invalid condition for dropdown question: " + condition + ". Must be a number.");
    } else {
      return (answerObj == condition);
    }
  }

  /**
   * Evaluate the show logic for a matrixrating question
   * @param {*} questionDef
   * @param {*} answerObj
   * @param {*} condition
   */
  _evaluateMatrixRatingLogic(questionDef, answerObj, condition)
  {}

  /**
   * Evaluate the show logic for a sort question
   * @param {*} questionDef
   * @param {*} answerObj
   * @param {*} condition
   */
  _evaluateSortLogic(questionDef, answerObj, condition)
  {}
};