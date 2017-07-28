import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import RadioQuestion from './types/radio.jsx';
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
   * Remind users about the rules
   */
  highlightInstructions() {
    console.log("The ruless!!");
  }

  /**
 * Render the view
 */
  render() {
    return (
      <div className="question">        
        {(this.props.title || this.props.name) && <h2>{this.props.title || this.props.name}</h2>}
        {this.props.instructions && <p className="instructions"><span className="fa fa-info-circle"></span> {this.props.instructions}</p>}
        {this.props.type == "checkbox" && <CheckboxQuestion {...this.props} onRemindAboutRules={this.highlightInstructions.bind(this)} />}
        {this.props.type == "radio" && <RadioQuestion {...this.props} onRemindAboutRules={this.highlightInstructions.bind(this)} />}
        {this.props.type == "dropdown" && <DropdownQuestion {...this.props} onRemindAboutRules={this.highlightInstructions.bind(this)} />}
        {this.props.type == "multipletext" && <MultipleTextQuestion {...this.props} onRemindAboutRules={this.highlightInstructions.bind(this)} />}
        {this.props.type == "rating" && <RatingQuestion {...this.props} onRemindAboutRules={this.highlightInstructions.bind(this)} />}
        {this.props.type == "text" && <TextQuestion {...this.props} onRemindAboutRules={this.highlightInstructions.bind(this)} />}
      </div>
    );
  }
}

// Expose the question
export default QuestionComponent;