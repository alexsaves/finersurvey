import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import RadioQuestion from './types/radio.jsx';
import CheckboxQuestion from './types/checkbox.jsx';
import RatingQuestion from './types/rating.jsx';
import StarsRatingQuestion from './types/stars.jsx';
import TextQuestion from './types/text.jsx';
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
    this.state = {
      alarmInstructions: false
    };
  }

  /**
   * Remind users about the rules
   */
  highlightInstructions() {
    this.setState({alarmInstructions: true});
  }

  /**
   * Animation is over
   */
  handleAnimationEnd(e) {
    let targ = e.target;
    if (targ.className.indexOf("instructions") > -1) {
      this.setState({alarmInstructions: false});
    }
  }

  /**
 * Render the view
 */
  render() {
    return (
      <div
        className="question"
        onAnimationEnd={this
        .handleAnimationEnd
        .bind(this)}>
        {(this.props.title || this.props.name) && <h2>{this.props.title || this.props.name}</h2>}
        {this.props.instructions && <p
          className={"instructions " + ((this.state.alarmInstructions || this.props.remindInstructions)
          ? "alarm"
          : "")}>
          <span className="fa fa-info-circle"></span>
          &nbsp;{this.props.instructions}</p>}
        {this.props.type == "checkbox" && <CheckboxQuestion
          {...this.props}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}        
        {this.props.type == "radio" && <RadioQuestion
          {...this.props}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "dropdown" && <DropdownQuestion
          {...this.props}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && !this.props.modifier && <RatingQuestion
          {...this.props}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && this.props.modifier == "stars" && <StarsRatingQuestion
          {...this.props}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "text" && <TextQuestion
          {...this.props}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
      </div>
    );
  }
}

// Expose the question
export default QuestionComponent;