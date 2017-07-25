import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class RatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
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
  }

  /**
 * Render the view
 */
  render() {
    let qname = this.props.name;
    let ratingScale = [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ];
    let ctx = this;
    let answer = this.props.answer || 0;
    return (
      <div className="question--rating">
        <div className="buttongroup">
          {ratingScale.map((rt, idx) => {
            return <label
              key={idx}
              className={"selectbutton question--ratingitem" + (!!(rt <= answer)
              ? " selected"
              : "")}>{rt}<input
              type="checkbox"
              checked={!!(rt <= answer)}
              name={qname}
              value={rt}
              onChange={ctx
              .handleAnswerChange
              .bind(ctx)}/></label>
          })}
        </div>
        {this.props.low && <span className="smalllabel lowlabel">{this.props.low}</span>}
        {this.props.high && <span className="smalllabel highlabel">{this.props.high}</span>}
      </div>
    );
  }
}

// Connect the component
const ConnectedRatingQuestion = connect()(RatingQuestion)

// Expose the question
export default ConnectedRatingQuestion;