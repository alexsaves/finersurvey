import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';

/**
* Represents a question
*/
class TextQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    let targ = e && e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByClassName("main--textfield");
    this
      .props
      .dispatch(changeAnswer(this.props.name, ipts[0].value));
  }

  /**
   * Handle when the text input changes (on a throttle)
   */
  handleIptThrottleChange(e) {
    if (e && e.keyCode == 13 && !(this.props.modifier && this.props.modifier.trim().toLowerCase() == "multiline")) {
      this.handleAnswerChange(e);
      if (this.props.onFullyAnswerQuestion) {
        this
          .props
          .onFullyAnswerQuestion();
      }
    } else {
      clearTimeout(this.iptThrottle);
      this.iptThrottle = setTimeout(() => {
        this.handleAnswerChange();
      }, 200);
    }
  }

  /**
 * Render the view
 */
  render() {
    let isMultiline = !!(this.props.modifier && this.props.modifier.trim().toLowerCase() == "multiline");
    let piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages;
    return (
      <div className="question--text">
        {isMultiline && <textarea
          type="text"
          className="main--textfield"
          placeholder={this.props.placeholder || ''}
          onKeyUp={this
          .handleIptThrottleChange
          .bind(this)}></textarea>}
        {!isMultiline && <input
          type="text"
          className="main--textfield"
          placeholder={this.props.placeholder || ''}
          onKeyUp={this
          .handleIptThrottleChange
          .bind(this)}/>}
      </div>
    );
  }
}

// Connect the component
const ConnectedTextQuestion = connect()(TextQuestion)

// Expose the question
export default ConnectedTextQuestion;