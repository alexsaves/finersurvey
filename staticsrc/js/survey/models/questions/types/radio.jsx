import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';
import Randomizer from '../../../components/randomizer';

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
    this.piper = new Piper();
    this.Randomizer = new Randomizer();
    this.state = {
      srcOrder: this
        .Randomizer
        .randomizeChoices(this.props.choices, this.props.random)
    };
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e, e2, skipAutoAdvance) {
    let targ = e && e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByTagName("input"),
      value = null,
      otherval = "",
      finalResponse = {};

    for (let i = 0; i < ipts.length; i++) {
      let ipt = ipts[i];
      if (ipt.type == "radio" && ipt.checked) {
        value = parseInt(ipt.value);
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
    if (this.props.onFullyAnswerQuestion && !skipAutoAdvance) {
      this
        .props
        .onFullyAnswerQuestion();
    }
  }

  /**
   * Handle when the text input changes (on a throttle)
   */
  handleIptThrottleChange() {
    clearTimeout(this.iptThrottle);
    this.iptThrottle = setTimeout(() => {
      this.handleAnswerChange(null, null, true);
    }, 200);
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

    let piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages;

    return (
      <div className="question--radio">
        {this
          .state
          .srcOrder
          .map((rto, idxo) => {
            let rt = rto.choice,
              idx = rto.originalPosition;
            return <label
              key={idx}
              className={"standalonebutton " + (shouldOptionBeSelected(idx)
              ? "selected"
              : "")}>{piper.pipe(rt, panswers, ppages)}<input
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
          placeholder={piper.pipe(this.props.otherplaceholder || '', panswers, ppages)}
          defaultValue={(this.props.answer && this.props.answer.other)
          ? this.props.answer.other
          : ''}
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