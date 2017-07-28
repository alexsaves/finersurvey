import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class RadioQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.iptThrottle = null;
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    let targ = e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByTagName("input"),
      value = null,
      otherval = "",
      finalResponse = {};

    for (let i = 0; i < ipts.length; i++) {
      let ipt = ipts[i];
      if (ipt.type == "radio" && ipt.checked) {
        value = ipt.value;
      } else if (ipt.type == "text") {
        otherval = ipt.value;
      }
    }
    finalResponse.response = value;
    if (this.props.other) {
      finalResponse.other = otherval;
    }
    this
      .props
      .dispatch(changeAnswer(this.props.name, finalResponse));
  }

  /**
   * Handle when the text input changes (on a throttle)
   */
  handleIptThrottleChange() {
    clearTimeout(this.iptThrottle);
    this.iptThrottle = setTimeout(() => {
      this.handleAnswerChange();
    }, 300);
  }

  /**
 * Render the view
 */
  render() {
    let qname = this.props.name,
      ctx = this,
      answer = this.props.answer;

    // Check each value
    let shouldOptionBeSelected = function (val) {
      if (answer) {
        return (answer.response == val) || (answer.response == val.toString());
      }
      return false;
    };

    return (
      <div className="question--radio">
        {this
          .props
          .choices
          .map((rt, idx) => {
            return <label
              key={idx}
              className={"standalonebutton " + (shouldOptionBeSelected(idx)
              ? "selected"
              : "")}>{rt}<input
              type="radio"
              name={qname}
              value={idx}
              onClick={ctx
              .handleAnswerChange
              .bind(ctx)}/></label>
          })}
        {this.props.other === true && <input
          type="text"
          className="other--textfield"
          placeholder={this.props.otherplaceholder || ''}
          onKeyUp={ctx
          .handleIptThrottleChange
          .bind(ctx)}/>}
      </div>
    );
  }
}

// Connect the component
const ConnectedRadioQuestion = connect()(RadioQuestion)

// Expose the question
export default ConnectedRadioQuestion;