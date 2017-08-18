import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import QuestionComponent from './questions/question.jsx';

/**
* Represents the entire survey
*/
class PageComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
  }

  /**
   * If there is an answer for a question, provide it
   * @param {*} q
   */
  getAnswerForQuestion(q) {
    return this.props.answers[q.name];
  }

  /**
   * A question was fully answered
   */
  handleQuestionFullyAnswered() {
    if (this.props.onFullyAnswerQuestion) {
      this
        .props
        .onFullyAnswerQuestion();
    }
  }

  /**
 * Render the view
 */
  render() {
    let ctx = this,
      remindInstructionsFor = this.props.remindInstructionsFor;
    return (
      <div
        className={"page " + (this.props.isSelected
        ? "selected"
        : "") + (this.props.animatingOutForward
        ? " animatingoutforward"
        : (this.props.animatingOutBackward
          ? " animatingoutbackward"
          : "")) + (this.props.animatingInForward
        ? " animatinginforward"
        : (this.props.animatingInBackward
          ? " animatinginbackward"
          : ""))}>
        <div className="questions">
          <div className="questions--listholder">
            {this
              .props
              .questions
              .map((q, idx) => {
                return <QuestionComponent
                  key={idx}
                  {...q}
                  answer={ctx.getAnswerForQuestion(q)}
                  answers={this.props.answers}
                  allpages={this.props.allpages}
                  onFullyAnswerQuestion={this
                  .handleQuestionFullyAnswered
                  .bind(this)}
                  isSelected={this.props.isSelected}
                  isAnimating={this.props.animatingOutForward || this.props.animatingOutBackward || this.props.animatingInForward || this.props.animatingInBackward}
                  remindInstructions={(remindInstructionsFor.indexOf(q.name) > -1)}/>
              })}
          </div>
        </div>
      </div>
    );
  }
}

// Expose the connected page
export default PageComponent;