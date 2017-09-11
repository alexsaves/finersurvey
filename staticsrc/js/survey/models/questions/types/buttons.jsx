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

    this.mounted = false;

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
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * The component unmounted
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
 * Render the view
 */
  render() {
    let ctx = this,
      piper = this.piper;
    if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        if (this.mounted) {
          this.wasFocused = true;
          let root = ReactDOM.findDOMNode(this);
          let btns = root.getElementsByTagName('button');
          if (btns.length > 0) {
            btns[0].focus();
          }
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
            let finalLabel = (val && val.title)
              ? val.title
              : "Continue";
            finalLabel = piper.pipe(finalLabel, ctx.props.answers, ctx.props.pages, ctx.props.variables, ctx.props.messages);
            return <button
              key={"_" + idx}
              tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
              className={"btn " + (val.color || "default")}
              data-choice={idx}
              onClick={this
              .handleClick
              .bind(this)}>{finalLabel}</button>
          })}
      </div>
    );
  }
}

// Connect the component
const ConnectedButtonsQuestion = connect()(ButtonsQuestion)

// Expose the question
export default ConnectedButtonsQuestion;