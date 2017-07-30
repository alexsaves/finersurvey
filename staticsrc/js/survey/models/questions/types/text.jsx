import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class TextQuestion extends React.Component {
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
      ipts = root.getElementsByClassName("main--textfield");
    this.props.dispatch(changeAnswer(this.props.name, ipts[0].value));
  }

  /**
   * Handle when the text input changes (on a throttle)
   */
  handleIptThrottleChange() {
    clearTimeout(this.iptThrottle);
    this.iptThrottle = setTimeout(() => {
      this.handleAnswerChange();
    }, 200);
  }

  /**
 * Render the view
 */
  render() {
    return (
      <div className="question--text">
        {this.props.multiline && <textarea
          type="text"
          className="main--textfield"
          placeholder={this.props.placeholder || ''}
          onKeyUp={this
          .handleIptThrottleChange
          .bind(this)}></textarea>}
        {!this.props.multiline && <input
          type="text"
          className="main--textfield"
          placeholder={this.props.placeholder || ''}
          onKeyUp={this
          .handleIptThrottleChange
          .bind(this)} />}
      </div>
    );
  }
}

// Connect the component
const ConnectedTextQuestion = connect()(TextQuestion)

// Expose the question
export default ConnectedTextQuestion;