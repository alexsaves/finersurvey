import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class DropdownQuestion extends React.Component {
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
    let targ = e && e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByClassName("dropdown-select");
    this.props.dispatch(changeAnswer(this.props.name, parseInt(ipts[0].value)));
  }

  /**
 * Render the view
 */
  render() {
    let answer = this.props.answer;

    return (
      <div className="question--dropdown">
        <select onChange={this.handleAnswerChange.bind(this)} className="dropdown-select" defaultValue={(answer && answer.response) || -1}>
          <option disabled={true} value={-1}>{this.props.placeholder || "Choose one..."}</option>
          {this
          .props
          .choices
          .map((rt, idx) => {
            return <option
              key={idx} value={idx}>{rt}</option>
          })}
        </select>
      </div>
    );
  }
}

// Connect the component
const ConnectedDropdownQuestion = connect()(DropdownQuestion)

// Expose the question
export default ConnectedDropdownQuestion;