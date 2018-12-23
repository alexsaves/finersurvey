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
class RadioQuestion extends React.Component {

  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.iptThrottle = null;
    this.piper = new Piper();
    this.wasFocused = false;
    this.Randomizer = new Randomizer();
    var choicesCopy = JSON.parse(JSON.stringify(this.props.choices));
    for (let k = 0; k < choicesCopy.length; k++) {
      choicesCopy[k] = this
        .piper
        .pipe(choicesCopy[k], props.answers, props.allpages, props.variables, props.messages);
      if (choicesCopy[k].toString().trim().length == 0) {
        choicesCopy.length = k;
        break;
      }
    }
    this.state = {
      otherisselected: false,
      choices: choicesCopy,
      srcOrder: JSON.parse(JSON.stringify(this.Randomizer.randomizeChoices(choicesCopy, this.props.random)))
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
  handleFocus() {
    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
    }
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e, e2, skipAutoAdvance) {
    let root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByTagName("input"),
      value = null,
      otherval = "",
      finalResponse = {},
      otheript = null;

    for (let i = 0; i < ipts.length; i++) {
      let ipt = ipts[i];
      if (ipt.type == "radio" && ipt.checked) {
        value = parseInt(ipt.value);
      } else if (ipt.type == "text") {
        otherval = ipt.value;
        otheript = ipt;
      }
    }
    finalResponse.response = value;
    if (this.props.other) {
      finalResponse.other = otherval;
      if (finalResponse.response != 9999) {
        // Clear the text box
        finalResponse.other = "";
        if (otheript) {
          otheript.value = "";
        }
      }
    }

    this
      .props
      .dispatch(changeAnswer(this.props.name, finalResponse));
    if (this.props.onFullyAnswerQuestion && !skipAutoAdvance) {
      this
        .props
        .onFullyAnswerQuestion();
    }

    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
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
    clearTimeout(this.iptThrottle);
    this.iptThrottle = setTimeout(() => {
      this.handleAnswerChange(null, null, true);
    }, 200);

    let targ = e.currentTarget,
      val = targ
        .value
        .trim(),
      root = ReactDOM.findDOMNode(this),
      otherrd = root.getElementsByClassName('other--rd')[0];

    if (val.length > 0) {
      otherrd.checked = true;
      this.setState({ otherisselected: true });
    } else {
      otherrd.checked = false;
      this.setState({ otherisselected: false });
    }
  }

  /**
 * Render the view
 */
  render() {
    let qname = this.props.name,
      ctx = this,
      answer = this.props.answer,
      piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages,
      variables = this.props.variables,
      otherisselected = this.state.otherisselected;

    // Check each value
    let shouldOptionBeSelected = function (val) {
      if (answer) {
        return (answer.response == val) || (answer.response == val.toString());
      }
      return false;
    };

    var opt = (
      <div className="question--radio">
        {this
          .state
          .srcOrder
          .map((rto, idxo) => {
            let rt = rto.choice,
              idx = rto.originalPosition;
            return <label
              key={Keymaker(idx + rt)}
              onKeyPress={this
                .handleKeyPress
                .bind(this)}
              tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber + idxo}
              className={"standalonebutton " + (shouldOptionBeSelected(idx)
                ? "selected"
                : "")}>{piper.pipe(rt, panswers, ppages, variables, ctx.props.messages)}<input
                type="radio"
                name={qname}
                value={idx}
                onClick={ctx
                  .handleAnswerChange
                  .bind(ctx)} /></label>
          })}
        {this.props.other === true && <label className="otherLabelStackButton"><input
          type="radio"
          name={qname}
          className="other--rd"
          value={9999}
          onClick={ctx
            .handleAnswerChange
            .bind(ctx)} /><input
            type="text"
            className={"other--textfield " + (otherisselected ? "selected" : "")}
            placeholder={piper.pipe(this.props.otherplaceholder || '', panswers, ppages, variables, this.props.messages)}
            defaultValue={(this.props.answer && this.props.answer.other)
              ? this.props.answer.other
              : ''}
            onFocus={ctx
              .handleFocus
              .bind(ctx)}
            onKeyUp={ctx
              .handleIptThrottleChange
              .bind(ctx)} />
        </label>}
      </div>
    );

    return opt;
  }
}

// Connect the component
const ConnectedRadioQuestion = connect()(RadioQuestion);

// Expose the question
export default ConnectedRadioQuestion;