import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class MatrixRatingQuestion extends React.Component {
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
    /*let targ = e && e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByClassName("main--textfield");
    this.props.dispatch(changeAnswer(this.props.name, ipts[0].value));*/
  }

  /**
 * Render the view
 */
  render() {
    return (
      <div className="question--matrixrating">
        <div className="matrix--carousel">
          {this
          .props
          .choices
          .map((rt, idx) => {
            return <div
              key={idx}
              className={"choiceitem"}><div className="choiceinner">{rt}</div></div>
          })}
          <a href="#" className="carousel--control left fa fa-chevron-left" title="Previous"></a>
          <a href="#" className="carousel--control right fa fa-chevron-right" title="Next"></a>
        </div>
        <div className="rating-zone">
          rater
        </div>
      </div>
    );
  }
}

// Connect the component
const ConnectedMatrixRatingQuestion = connect()(MatrixRatingQuestion)

// Expose the question
export default ConnectedMatrixRatingQuestion;