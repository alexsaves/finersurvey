import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';

/**
* Represents a question
*/
class CheckboxQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.iptThrottle = null;
    this.piper = new Piper();
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    let targ = e && e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByTagName("input"),
      responses = [],
      otherval = "",
      finalResponse = {},
      howManySelected = 0,
      limits = this.props.limits;
      
    if (window.testdd) {
      debugger;
    }

    for (let i = 0; i < ipts.length; i++) {
      let ipt = ipts[i];
      if (ipt.type == "checkbox" && ipt.checked) {
        responses.push(parseInt(ipt.name));
        howManySelected++;
      } else if (ipt.type == "text") {
        otherval = ipt.value;
      }
    }
    finalResponse.responses = responses;
    if (this.props.other) {
      finalResponse.other = otherval;
    }
    if ((!limits || typeof limits.max == 'undefined') || (limits.max >= howManySelected)) {
      this
        .props
        .dispatch(changeAnswer(this.props.name, finalResponse));
    } else if (e) {      
      if (targ.checked) {
        targ.checked = false;
      }
      e.stopPropagation();
      e.preventDefault();
      if (this.props.onRemindAboutRules) {
        this.props.onRemindAboutRules();
      }
    }
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

    let piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages;

    // Check each value
    let shouldOptionBeSelected = function (val) {
      if (answers) {
        let result = answers
          .responses
          .indexOf(parseInt(val));
        return (result > -1);
      }
      return false;
    };
    return (
      <div className="question--checkbox">
        {this
          .props
          .choices
          .map((rt, idx) => {
            return <label
              key={idx}
              className={"standalonebutton " + (shouldOptionBeSelected(idx)
              ? "selected"
              : "")}>{piper.pipe(rt, panswers, ppages)}<input
              type="checkbox"
              name={idx}
              value={idx}
              defaultChecked={shouldOptionBeSelected(idx)}
              onChange={ctx
              .handleAnswerChange
              .bind(ctx)}/></label>
          })}
        {this.props.other === true && <input
          type="text"
          className="other--textfield"
          placeholder={piper.pipe(this.props.otherplaceholder || '', panswers, ppages)}
          onKeyUp={ctx
          .handleIptThrottleChange
          .bind(ctx)}
          defaultValue={((this.props.answer && this.props.answer.other) ? this.props.answer.other : "")}
          />}
      </div>
    );
  }
}

// Connect the component
const ConnectedCheckboxQuestion = connect()(CheckboxQuestion)

// Expose the question
export default ConnectedCheckboxQuestion;