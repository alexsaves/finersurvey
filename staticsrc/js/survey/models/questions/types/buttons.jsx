import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';
import Randomizer from '../../../components/randomizer';

/**
* Represents a question
*/
class ButtonsQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
    this.Randomizer = new Randomizer();
    this.wasFocused = false;
    this.state = {
      srcOrder: this
        .Randomizer
        .randomizeChoices(this.props.choices, this.props.random)
    };
  }

  /**
   * Handle the click
   * @param {*} e
   */
  handleClick(e) {
    if (e) {
      e.stopPropagation();
    }
    let targ = e.currentTarget,
      choice = parseInt(targ.getAttribute('data-choice')),
      choiceObj = this.props.choices[choice];

    this
      .props
      .dispatch(changeAnswer(this.props.name, choice));

    if (choiceObj.href) {
      clearTimeout(this.navTimeout);
      this.navTimeout = setTimeout(() => {
        window.location = choiceObj.href;
      }, 250);
    } else if (this.props.onFullyAnswerQuestion) {
      this
        .props
        .onFullyAnswerQuestion();
    }

    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
    }
  }

  /**
   * The component mounted
   */
  componentDidMount() {}

  /**
 * Render the view
 */
  render() {
    let ctx = this;
    if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        this.wasFocused = true;
        let root = ReactDOM.findDOMNode(this);
        let btns = root.getElementsByTagName('button');
        if (btns.length > 0) {
          btns[0].focus();
        }
      }, 25);
    }
    // Spit out the node
    return (
      <div className="question--buttons">
        {this
          .props
          .choices
          .map((val, idx) => {
            return <button
              key={"_" + idx}
              tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
              className={"btn " + (val.color || "default")}
              data-choice={idx}
              onClick={this
              .handleClick
              .bind(this)}>{val.title || "Continue"}</button>
          })}
      </div>
    );
  }
}

// Connect the component
const ConnectedButtonsQuestion = connect()(ButtonsQuestion)

// Expose the question
export default ConnectedButtonsQuestion;