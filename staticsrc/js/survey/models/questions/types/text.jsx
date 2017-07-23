import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

/**
* Represents a question
*/
class TextQuestion extends React.Component {
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
    console.log("text", this.props); 
    return (
      <div className="question--text">
        text
      </div>
    );
  }
}

// Expose the question
export default TextQuestion;