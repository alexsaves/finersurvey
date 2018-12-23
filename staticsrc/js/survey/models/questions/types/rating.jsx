import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { changeAnswer } from '../../../../actions';
import Piper from '../../../components/piper';

/**
* Represents a question
*/
class RatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.wasFocused = false;
    this.piper = new Piper();
  }

  /**
   * The component mounted
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * Component is unmounting
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    let targ = e.currentTarget,
      val = parseInt(targ.value);
    this
      .props
      .dispatch(changeAnswer(this.props.name, val));
    if (this.props.onFullyAnswerQuestion) {
      this
        .props
        .onFullyAnswerQuestion();
    }
    // Signal that the user is interacting with the question
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
    let qname = this.props.name,
      ratingScale = [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      ctx = this,
      answer = this.props.answer || 0;

    if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        this.wasFocused = true;
        let root = ReactDOM.findDOMNode(this),
          btns = root.getElementsByTagName('label');
        if (btns.length > 0) {
          btns[0].focus();
        }
      }, 25);
    }

    return (
      <div className="question--rating">
        <div className="buttongroup">
          {ratingScale.map((rt, idx) => {
            return <label
              key={idx}
              className={"selectbutton question--ratingitem" + ((rt <= answer)
                ? " selected"
                : "")}>{rt}<input
                type="checkbox"
                checked={!!(rt <= answer)}
                name={qname}
                tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
                value={rt}
                onChange={ctx
                  .handleAnswerChange
                  .bind(ctx)} /></label>
          })}
        </div>
        <div className="labelcontainer">
          {this.props.low && <span className="smalllabel lowlabel">{this.props.low}</span>}
          {this.props.high && <span className="smalllabel highlabel">{this.props.high}</span>}
        </div>
      </div>
    );
  }
}

// Connect the component
const ConnectedRatingQuestion = connect()(RatingQuestion)

// Expose the question
export default ConnectedRatingQuestion;
