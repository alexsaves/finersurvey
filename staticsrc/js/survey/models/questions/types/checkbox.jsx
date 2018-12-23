import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { changeAnswer } from '../../../../actions';
import Piper from '../../../components/piper';
import Randomizer from '../../../components/randomizer';
import Keymaker from '../../../components/keymaker';

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
    this.wasFocused = false;
    this.piper = new Piper();
    this.Randomizer = new Randomizer();
    this.state = {
      otherval: ((this.props.answer && this.props.answer.other)
        ? this.props.answer.other
        : ""),
      srcOrder: this
        .Randomizer
        .randomizeChoices(this.props.choices, this.props.random)
    };
  }

  /**
   * The component mounted
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * Component is unmounting
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Handle focus on the input
   * @param {*} e
   */
  handleFocus(e) {
    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
    }
    // Now check is we shouldnt be typing here
    let targ = e.currentTarget,
      limits = this.props.limits;
    if (e && limits && typeof limits.max != 'undefined' && this.props.answer) {
      let totalCount = this.props.answer.responses.length;
      if (totalCount >= limits.max && this.props.answer.responses.indexOf(9999) == -1) {
        e.preventDefault();
        targ.blur();
        return false;
      }
    }
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

    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
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
      if (otherval && otherval.trim().length > 0) {
        responses.push(9999);
        this.setState({ otherval: otherval });
      }
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
        this
          .props
          .onRemindAboutRules();
      }
    }
  }

  /**
   * Handle click
   * @param {*} e
   */
  handleClick(e) {
    let limits = this.props.limits;
    let targ = e && e.currentTarget,
      oval = parseInt(targ.getAttribute("data-originalValue"));
    if (e && limits && typeof limits.max != 'undefined' && this.props.answer) {
      let totalCount = this.props.answer.responses.length;
      if (totalCount >= limits.max && this.props.answer.responses.indexOf(oval) == -1) {
        e.preventDefault();
        return false;
      }
    }
  }

  /**
   * Handle Keypress
   * @param {*} e
   */
  handleKeyPress(e) {
    if (e) {
      if (e.key == "Enter" || e.key == " ") {
        let targ = e.currentTarget,
          cb = targ.getElementsByTagName("input")[0];

        cb.checked = !cb.checked;
        e.currentTarget = cb;
        this.handleAnswerChange(e);
      }
    }
  }

  /**
   * Handle when the text input changes (on a throttle)
   */
  handleIptThrottleChange(e) {
    let targ = e.currentTarget;
    clearTimeout(this.iptThrottle);
    this.iptThrottle = setTimeout(() => {
      this.handleAnswerChange();
      this.setState({ otherval: targ.value });
    }, 200);
  }

  /**
 * Render the view
 */
  render() {
    let ctx = this,
      answers = this.props.answer,
      variables = this.props.variables,
      piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages,
      otherval = this.state.otherval;

    // Check each value
    let shouldOptionBeSelected = function (val) {
      if (answers && answers.responses) {
        let result = answers
          .responses
          .indexOf(parseInt(val));
        return (result > -1);
      }
      return false;
    };

    // Spit out the main question node
    return (
      <div className="question--checkbox">
        {this
          .state
          .srcOrder
          .map((rto, idxo) => {
            let rt = rto.choice,
              idx = rto.originalPosition;
            return <label
              key={Keymaker(idx + rt)}
              onClick={this
                .handleClick
                .bind(this)}
              data-originalValue={idx}
              onKeyPress={this
                .handleKeyPress
                .bind(this)}
              tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber + idxo}
              className={"standalonebutton " + (shouldOptionBeSelected(idx)
                ? "selected"
                : "")}>{piper.pipe(rt, panswers, ppages, variables, ctx.props.messages)}<input
                type="checkbox"
                name={idx}
                value={idx}
                defaultChecked={shouldOptionBeSelected(idx)}
                onChange={ctx
                  .handleAnswerChange
                  .bind(ctx)} /></label>
          })}
        {this.props.other === true && <input
          type="text"
          className={"other--textfield " + ((otherval !== null && otherval.length > 0)
            ? "selected"
            : "")}
          tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber + this.state.srcOrder.length + 1}
          onFocus={this
            .handleFocus
            .bind(this)}
          placeholder={piper.pipe(this.props.otherplaceholder || '', panswers, ppages, variables, this.props.messages)}
          onKeyUp={ctx
            .handleIptThrottleChange
            .bind(ctx)}
          defaultValue={((this.props.answer && this.props.answer.other)
            ? this.props.answer.other
            : "")} />}
      </div>
    );
  }
}

// Connect the component
const ConnectedCheckboxQuestion = connect()(CheckboxQuestion);

// Expose the question
export default ConnectedCheckboxQuestion;