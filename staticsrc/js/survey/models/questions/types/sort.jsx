import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class SortQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.iptThrottle = null;
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
    let qname = this.props.name,
      ctx = this,
      answers = this.props.answer;

    return (
      <div className="question--sort">
        {this
          .props
          .choices
          .map((rt, idx) => {
            return <label key={idx} className={"sortable standalonebutton "}><span className="sorticon fa fa-sort" /> {rt}<input type="hidden" name={idx} value={idx}/></label>
          })}
        {this.props.other === true && <label className={"sortable standalonebutton"}><div className="sortitem--container"><span className="sorticon fa fa-sort" /> <input
          type="text"
          className="other--textfield"
          placeholder={this.props.otherplaceholder || ''}
          onKeyUp={ctx
          .handleIptThrottleChange
          .bind(ctx)}/></div></label>}
      </div>
    );
  }
}

// Connect the component
const ConnectedSortQuestion = connect()(SortQuestion)

// Expose the question
export default ConnectedSortQuestion;