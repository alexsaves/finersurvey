/**
 * Randomizer
 */
export default class {
  /**
   * Set up a new randomizer
   */
  constructor() {}

  /**
   * Produces a random order
   * @param {*} choices
   */
  randomizeChoices(choices = [], doRandom = false) {
    var result = [],
      which = 0;
    choices.forEach((ch) => {
      result.push({
        originalPosition: which++,
        choice: ch
      });
    });

    if (doRandom) {
      // random
      for (var i = 0; i < (choices.length * 4); i++) {
        which = Math.min(result.length - 1, Math.round(Math.random() * (result.length - 1)));
        var item = result.splice(which, 1)[0];
        result.push(item);
      }
    }
    return result;
  }

};