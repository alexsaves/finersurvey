import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';

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
    }
  }

  /**
 * Render the view
 */
  render() {

    // Spit out the node
    return (
      <div className="question--buttons">
        {this
          .props
          .choices
          .map((val, idx) => {
            return <button
              key={"_" + idx}
              className={val.color || "default"}
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