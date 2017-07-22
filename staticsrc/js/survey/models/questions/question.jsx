import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

/**
* Represents a question
*/
class QuestionComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
  }

  /**
 * Render the view
 */
  render() {    
    return (
      <div className="question">
        question
      </div>
    );
  }
}

// Expose the question
export default QuestionComponent;