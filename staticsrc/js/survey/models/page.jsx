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
 * Render the view
 */
  render() {
    let ctx = this;    
    return (
      <div
        className={"page " + (this.props.isSelected
        ? "selected"
        : "")}>
        <div className="questions">
          {this
            .props
            .questions
            .map((q, idx) => {
              return <QuestionComponent key={idx} {...q} answer={ctx.getAnswerForQuestion(q)} />
            })}
        </div>
      </div>
    );
  }
}

// Expose the connected page
export default PageComponent;