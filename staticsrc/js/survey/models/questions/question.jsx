import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import CheckboxQuestion from './types/checkbox.jsx';
import RatingQuestion from './types/rating.jsx';
import TextQuestion from './types/text.jsx';
import MultipleTextQuestion from './types/multipletext.jsx';
import DropdownQuestion from './types/dropdown.jsx';

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
        {(this.props.title || this.props.name) && <h2>{this.props.title || this.props.name}</h2>}
        {this.props.instructions && <p className="instructions">{this.props.instructions}</p>}
        {this.props.type == "checkbox" && <CheckboxQuestion {...this.props} />}
        {this.props.type == "dropdown" && <DropdownQuestion {...this.props} />}
        {this.props.type == "multipletext" && <MultipleTextQuestion {...this.props} />}
        {this.props.type == "rating" && <RatingQuestion {...this.props} />}
        {this.props.type == "text" && <TextQuestion {...this.props} />}
      </div>
    );
  }
}

// Expose the question
export default QuestionComponent;