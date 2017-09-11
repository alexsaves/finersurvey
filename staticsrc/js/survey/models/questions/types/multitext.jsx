import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';
import Randomizer from '../../../components/randomizer';

/**
* Represents a question
*/
class MultiTextQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
    this.wasFocused = false;
    this.Randomizer = new Randomizer();
    this.state = {
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
      ipts = root.getElementsByClassName("ipt"),
      dvals = [];

    for (let i = 0; i < ipts.length; i++) {
      dvals.push("");
    }
    for (let i = 0; i < ipts.length; i++) {
      dvals[this.state.srcOrder[i].originalPosition] = ipts[i].value;
    }
    this
      .props
      .dispatch(changeAnswer(this.props.name, dvals));
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
  handleTypeThrottle(e) {
    let root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByClassName('ipt'),
      targ = e.target,
      dataWhich = parseInt(targ.getAttribute("data-which")),
      dataOrder = parseInt(targ.getAttribute("data-order"));

    if (e && e.keyCode == 13 && !(this.props.modifier && this.props.modifier.trim().toLowerCase() == "multiline")) {
      this.handleAnswerChange(e);
      if (dataOrder < ipts.length - 1) {
        ipts[dataOrder + 1].focus();
      } else {
        if (this.props.onFullyAnswerQuestion) {
          this
            .props
            .onFullyAnswerQuestion();
        }
      }
    } else {
      clearTimeout(this.iptThrottle);
      this.iptThrottle = setTimeout(() => {
        this.handleAnswerChange();
      }, 200);
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
      panswer = this.props.answer,
      panswers = this.props.answers,
      ppages = this.props.allpages,
      variables = this.props.variables;

    if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        this.wasFocused = true;
        let root = ReactDOM.findDOMNode(this),
          btns = root.getElementsByTagName('input');
        if (btns.length > 0) {
          btns[0].focus();
        }
      }, 25);
    }

    // Spit out the node
    return (
      <div className="question--multitext">
        {this
          .state
          .srcOrder
          .map((rto, idxo) => {
            let rt = rto.choice,
              idx = rto.originalPosition;

            let storedValue = "";
            if (panswer && panswer.length > 0) {
              storedValue = panswer[idx];
            }
            return <input
              type="text"
              key={idx}
              tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber + idxo}
              onFocus={this
              .handleFocus
              .bind(this)}
              data-which={idx}
              data-order={idxo}
              placeholder={piper.pipe(rt, panswers, ppages, variables, ctx.props.messages)}
              defaultValue={storedValue}
              onKeyDown={this
              .handleTypeThrottle
              .bind(this)}
              className="ipt"/>
          })}
      </div>
    );
  }
}

// Connect the component
const ConnectedMultiTextQuestion = connect()(MultiTextQuestion);

// Expose the question
export default ConnectedMultiTextQuestion;