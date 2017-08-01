import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class SliderRatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 50
    };
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
    let ctx = this;
    let answer = this.props.answer || 0;
    return (
      <div className="question--rating slider">
        <div className="slider--container">
          <div className="slider--backdrop"></div>
          <div className="slider--ball"></div>
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
const ConnectedSliderRatingQuestion = connect()(SliderRatingQuestion)

// Expose the question
export default ConnectedSliderRatingQuestion;