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
    let firstQuestionWithInput = this.getNextQuestionWithInput(-1, props);
    this.state = {
      focusItem: firstQuestionWithInput
    };
  }

  /**
   * Returns the next question with an input
   */
  getNextQuestionWithInput(starting, props) {
    let firstQuestionWithInput = starting;
    for (let i = starting + 1; i < props.questions.length; i++) {
      firstQuestionWithInput = i;
      let q = props.questions[i];
      if (!(q.type == 'none' || q.type == 'image')) {
        break;
      }
    }
    return firstQuestionWithInput;
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
    setTimeout(() => {
      // Find the next interactable question
      let nextOne = this.getNextQuestionWithInput(this.state.focusItem, this.props);
      this.setState({
        focusItem: nextOne
      })
    }, 10);

  }

  /**
   * A question is being interacted with
   */
  handleQuestionBeingInteractedWith(idx) {
    this.setState({focusItem: idx});
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
      remindInstructionsFor = this.props.remindInstructionsFor,
      pageNumber = this.props.pageNumber;      

    return (
      <div
        data-page={pageNumber}
        data-focus={this.state.focusItem}
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
                let interactionBinding = function (indx) {
                  return function () {
                    ctx.handleQuestionBeingInteractedWith(indx);
                  };
                }(idx);
                return <QuestionComponent
                  key={idx}
                  {...q}
                  pageNumber={pageNumber}
                  questionNumber={idx}
                  answer={ctx.getAnswerForQuestion(q)}
                  answers={this.props.answers}
                  messages={this.props.messages}
                  variables={this.props.variables}
                  isFocused={ctx.props.isSelected && ctx.state.focusItem == idx}
                  allpages={this.props.allpages}
                  onQuestionBeingInteractedWith={interactionBinding}
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