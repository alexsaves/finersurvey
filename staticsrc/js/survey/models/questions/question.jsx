import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import RadioQuestion from './types/radio.jsx';
import CheckboxQuestion from './types/checkbox.jsx';
import RatingQuestion from './types/rating.jsx';
import StarsRatingQuestion from './types/stars.jsx';
import SliderRatingQuestion from './types/slider.jsx';
import TextQuestion from './types/text.jsx';
import DropdownQuestion from './types/dropdown.jsx';
import MatrixRatingQuestion from './types/matrixrating.jsx';
import SortQuestion from './types/sort.jsx';
import Piper from '../../components/piper';

/**
* Represents a question
*/
class QuestionComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
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
   * A question was fully answered
   */
  handleFullyAnswerQuestion() {
    if (this.props.onFullyAnswerQuestion) {
      this.props.onFullyAnswerQuestion();
    }
  }

  /**
 * Render the view
 */
  render() {
    let piper = this.piper,
      answers = this.props.answers,
      pages = this.props.allpages,
      image = this.props.image;
      
    return (
      <div
        className="question"
        onAnimationEnd={this
        .handleAnimationEnd
        .bind(this)}>
        {(this.props.title || this.props.name) && <h2>{this.props.displayNumber && <span className="question--number">{this.props.questionNumber}. </span>}{piper.pipe(this.props.title || this.props.name, answers, pages)}</h2>}
        {this.props.subtitle && <p className="subtitle">{piper.pipe(this.props.subtitle, answers, pages)}</p>}
        {image && <p><img src={image.url} className={"question--image " + ((image.size || "").toLowerCase())} /></p>}
        {this.props.instructions && <p
          className={"instructions " + ((this.state.alarmInstructions || this.props.remindInstructions)
          ? "alarm"
          : "")}>
          <span className="fa fa-info-circle"></span>
          &nbsp;{this.props.instructions}</p>}
        {this.props.type == "matrixrating" && <MatrixRatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "checkbox" && <CheckboxQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}        
        {this.props.type == "radio" && <RadioQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "dropdown" && <DropdownQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && (!this.props.modifier || this.props.modifier == "buttons") && <RatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && this.props.modifier == "stars" && <StarsRatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && this.props.modifier == "slider" && <SliderRatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "text" && <TextQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "sort" && <SortQuestion
          {...this.props}
          onFullyAnswerQuestion={this.handleFullyAnswerQuestion.bind(this)}
          isSelected={this.props.isSelected}
          isAnimating={this.props.isAnimating}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
      </div>
    );
  }
}

// Expose the question
export default QuestionComponent;