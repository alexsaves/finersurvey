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
      for (let i = 0; i < (choices.length * 5); i++) {
        which = Math.min(result.length - 1, Math.round(Math.random() * (result.length - 1)));
        var item = result.splice(which, 1)[0];
        result.push(item);
      }

      // Force underscore items to the bottom
      for (let i = 0; i < choices.length; i++) {
        let ch = result[i].choice;
        if (typeof(ch) == 'string') {
          ch = ch.trim();
          if (ch.length > 0) {
            if (ch.substr(0, 1) == "_") {
              var item = result.splice(i, 1)[0];
              item.choice = ch.substr(1);
              result.push(item);
            } else if (ch.substr(0, 1) == "^") {
              var item = result.splice(i, 1)[0];
              item.choice = ch.substr(1);
              result.unshift(item);
            }
          }
        }
      }
    }
    return result;
  }

};