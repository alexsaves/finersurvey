import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

/**
* Represents a question
*/
class CheckboxQuestion extends React.Component {
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
    console.log("checkbox", this.props); 
    return (
      <div className="question--checkbox">
        checkbox
      </div>
    );
  }
}

// Expose the question
export default CheckboxQuestion;