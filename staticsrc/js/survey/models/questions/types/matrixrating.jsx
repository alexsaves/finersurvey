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
    let answer = 0;
    return (
      <div className="question--matrixrating">
        <div className="matrix--carousel">
          {this
            .props
            .choices
            .map((rt, idx) => {
              return <div key={idx} className={"choiceitem"}>
                <div className="choiceinner">{rt}</div>
              </div>
            })}
          <a
            href="#"
            className="carousel--control left fa fa-chevron-left"
            title="Previous"></a>
          <a
            href="#"
            className="carousel--control right fa fa-chevron-right"
            title="Next"></a>
        </div>
        <div className="rating-zone">
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
            <div className="labelcontainer">
              {this.props.low && <span className="smalllabel lowlabel">{this.props.low}</span>}
              {this.props.high && <span className="smalllabel highlabel">{this.props.high}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Connect the component
const ConnectedMatrixRatingQuestion = connect()(MatrixRatingQuestion)

// Expose the question
export default ConnectedMatrixRatingQuestion;