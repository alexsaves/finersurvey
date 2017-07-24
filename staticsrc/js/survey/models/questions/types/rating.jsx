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
    console.log(this, this.props, this.props.dispatch);
    this.props.dispatch(changeAnswer(this.props.name, val));
    console.log(targ);
  }

  /**
 * Render the view
 */
  render() {
    console.log("rating", this.props);
    let qname = this.props.name;
    let ratingScale = [1,2,3,4,5,6,7];
    let ctx = this;
    return (
      <div className="question--rating">
        {ratingScale.map((rt, idx) => {
          return <label key={idx} className={"question--ratingitem"}>{rt}<input type="checkbox" name={qname} value={rt} onChange={ctx.handleAnswerChange.bind(ctx)} /></label>
        })}
      </div>
    );
  }
}

// Connect the component
const ConnectedRatingQuestion = connect()(RatingQuestion)

// Expose the question
export default ConnectedRatingQuestion;