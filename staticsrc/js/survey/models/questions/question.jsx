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
import MatrixRadioQuestion from './types/matrixradio.jsx';
import SortQuestion from './types/sort.jsx';
import ButtonsQuestion from './types/buttons.jsx';
import MultitextQuestion from './types/multitext.jsx';
import LinkQuestion from './types/link.jsx';
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
      this
        .props
        .onFullyAnswerQuestion();
    }
  }

  /**
   * The question is being interacted with
   */
  handleQuestionBeingInteractedWith() {
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
    let piper = this.piper,
      answers = this.props.answers,
      pages = this.props.allpages,
      image = this.props.image;

    return (
      <div
        className="question"
        data-is-focused={this.props.isFocused}
        onAnimationEnd={this
        .handleAnimationEnd
        .bind(this)}>
        {(this.props.title) && <h2>{this.props.displayNumber && <span className="question--number">{this.props.questionNumber}.
          </span>}{piper.pipe(this.props.title, answers, pages, this.props.variables, this.props.messages)}</h2>}
        {this.props.subtitle && <p className="subtitle">{piper.pipe(this.props.subtitle, answers, pages, this.props.variables, this.props.messages)}</p>}
        {image && !image.link && <p><img
          src={image.url}
          title={image.title
          ? image.title
          : null}
          className={"question--image " + ((image.modifier || "").toLowerCase())}/></p>}
        {image && image.link && <p>
          <a href={image.link}><img
            src={image.url}
            title={image.title
          ? image.title
          : null}
            className={"question--image " + ((image.modifier || "").toLowerCase())}/></a>
        </p>}
        {this.props.instructions && <p
          className={"instructions " + ((this.state.alarmInstructions || this.props.remindInstructions)
          ? "alarm"
          : "")}>
          <span className="fa fa-info-circle"></span>
          &nbsp;{this.props.instructions}</p>}
        {this.props.type == "hr" && <hr/>}
        {(this.props.type == "buttons" || this.props.type == "button") && <ButtonsQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "link" && <LinkQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "matrixrating" && <MatrixRatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "matrixradio" && <MatrixRadioQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "checkbox" && <CheckboxQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "radio" && <RadioQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "dropdown" && <DropdownQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && (!this.props.modifier || this.props.modifier == "buttons") && <RatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && this.props.modifier == "stars" && <StarsRatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "rating" && this.props.modifier == "slider" && <SliderRatingQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "text" && <TextQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "multitext" && <MultitextQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
          onRemindAboutRules={this
          .highlightInstructions
          .bind(this)}/>}
        {this.props.type == "sort" && <SortQuestion
          {...this.props}
          onFullyAnswerQuestion={this
          .handleFullyAnswerQuestion
          .bind(this)}
          onQuestionBeingInteractedWith={this
          .handleQuestionBeingInteractedWith
          .bind(this)}
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