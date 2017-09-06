import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';
import Randomizer from '../../../components/randomizer';

/**
* Represents a question
*/
class TextQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
    this.wasFocused = false;
    this.Randomizer = new Randomizer();
    this.state = {
      charcount: 0,
      wordcount: 0,
      srcOrder: this
        .Randomizer
        .randomizeChoices(this.props.choices, this.props.random)
    };
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    let targ = e && e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByClassName("main--textfield");

    if (this.props.modifier == 'number' || this.props.modifier == 'integer') {
      var nval = ipts[0].value;
      nval = parseFloat(nval);
      if (isNaN(nval)) {
        nval = null;
      }
      this
        .props
        .dispatch(changeAnswer(this.props.name, nval));
    } else {
      this
        .props
        .dispatch(changeAnswer(this.props.name, ipts[0].value.toString()));
    }
    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
    }
  }

  /**
   * Handle when the text input changes (on a throttle)
   */
  handleIptThrottleChange(e) {
    let root = ReactDOM.findDOMNode(this),
      ipt = root.getElementsByClassName('main--textfield')[0];

    this.setState({
      charcount: ipt.value.length,
      wordcount: ipt
        .value
        .trim()
        .split(' ')
        .length
    });

    if (e && e.keyCode == 13 && !(this.props.modifier && this.props.modifier.trim().toLowerCase() == "multiline")) {
      this.handleAnswerChange(e);
      if (this.props.onFullyAnswerQuestion) {
        this
          .props
          .onFullyAnswerQuestion();
      }
    } else {
      clearTimeout(this.iptThrottle);
      this.iptThrottle = setTimeout(() => {
        this.handleAnswerChange();
      }, 200);
    }
  }

  /**
   * Validate a keypress
   * @param {*} e
   */
  validateKeyDown(e) {
    if (e) {
      let validKeys = [
        91,
        13,
        37,
        39,
        8,
        46,
        27,
        9
      ];
      if (validKeys.indexOf(e.keyCode) == -1 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if ((this.props.modifier == 'number') && !!!e.key.match(/[0-9\.]/)) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        if ((this.props.modifier == 'integer') && !!!e.key.match(/[0-9]/)) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      }
    }
  }

  /**
   * Handle focus on the input
   * @param {*} e
   */
  handleFocus(e) {
    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
    }
  }

  /**
 * Render the view
 */
  render() {
    let ctx = this,
      isMultiline = !!(this.props.modifier && this.props.modifier.trim().toLowerCase() == "multiline"),
      piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages,
      limits = this.props.limits,
      charlim = limits && limits.character,
      wordlim = limits && limits.word,
      limittext = null,
      limitalarm = false,
      wordlimitalarm = false,
      wordlimittext = null,
      iptType = "text";

    if (this.props.modifier == 'email') {
      iptType = 'email';
    } else if (this.props.modifier == 'number' || this.props.modifier == 'integer') {
      iptType = 'number';
    }

    // Deal with character limits
    if (limits && charlim) {
      if (charlim.max) {
        limittext = charlim.max - this.state.charcount;
        if (charlim.max - this.state.charcount < 0) {
          limitalarm = true;
        }
      } else {
        limittext = this.state.charcount;
        if (charlim.min) {
          if (this.state.charcount < charlim.min) {
            limitalarm = true;
          }
        }
      }
    }

    // Deal with word limits
    if (limits && wordlim) {
      if (wordlim.max) {
        wordlimittext = this.props.wordcountmaxlabel + ": " + (wordlim.max - this.state.wordcount);
        if (wordlim.max - this.state.wordcount < 0) {
          wordlimitalarm = true;
        }
      } else {
        wordlimittext = this.props.wordcountlabel + ": " + this.state.wordcount;
        if (wordlim.min) {
          if (this.state.wordcount < wordlim.min) {
            wordlimitalarm = true;
          }
        }
      }
    }

    if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        this.wasFocused = true;
        let root = ReactDOM.findDOMNode(this),
          btns = root.getElementsByClassName('main--textfield');
        if (btns.length > 0) {
          btns[0].focus();
        }
      }, 25);
    }

    // Spit out the node
    return (
      <div className="question--text">
        {isMultiline && <div className="text--outercontainer">
          <div className="text--inputcontainer">
            <textarea
              type="text"
              className="main--textfield"
              tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
              placeholder={this.props.placeholder || ''}
              onFocus={this
              .handleFocus
              .bind(this)}
              onKeyDownCapture={this
              .validateKeyDown
              .bind(this)}
              onKeyUp={this
              .handleIptThrottleChange
              .bind(this)}
              defaultValue={this.props.answer}></textarea>{limittext != null && <span
              className={"textquestion--charcount" + (limitalarm
              ? " bad"
              : "")}>{limittext}</span>}</div>{!!wordlimittext && <span
            className={"textquestion--wordcount" + (wordlimitalarm
            ? " bad"
            : "")}>{wordlimittext}</span>}</div>}
        {!isMultiline && <div className="text--outercontainer">
          <div className="text--inputcontainer"><input
            type={iptType}
            tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
            onKeyDownCapture={this
          .validateKeyDown
          .bind(this)}
            onFocus={this
          .handleFocus
          .bind(this)}
            className="main--textfield"
            placeholder={this.props.placeholder || ''}
            onKeyUp={this
          .handleIptThrottleChange
          .bind(this)}
            defaultValue={this.props.answer}/>{limittext != null && <span
              className={"textquestion--charcount" + (limitalarm
              ? " bad"
              : "")}>{limittext}</span>}</div>{!!wordlimittext && <span
            className={"textquestion--wordcount" + (wordlimitalarm
            ? " bad"
            : "")}>{wordlimittext}</span>}</div>}
      </div>
    );
  }
}

// Connect the component
const ConnectedTextQuestion = connect()(TextQuestion)

// Expose the question
export default ConnectedTextQuestion;