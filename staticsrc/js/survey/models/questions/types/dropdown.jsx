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
class DropdownQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
    this.wasFocused = false;
    this.Randomizer = new Randomizer();
    this.state = {
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
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange() {
    let root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByClassName("dropdown-select");
    this
      .props
      .dispatch(changeAnswer(this.props.name, parseInt(ipts[0].value)));
    if (this.props.onFullyAnswerQuestion) {
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
 * Render the view
 */
  render() {
    let ctx = this,
      answer = this.props.answer,
      piper = this.piper,
      variables = this.props.variables,
      panswers = this.props.answers,
      ppages = this.props.allpages;

    return (
      <div className="question--dropdown">
        <select
          tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
          onChange={this
            .handleAnswerChange
            .bind(this)}
          className="dropdown-select"
          defaultValue={(typeof (answer) != 'undefined' && answer !== null)
            ? answer
            : -1}>
          <option disabled={true} value={-1}>{piper.pipe(this.props.placeholder || "Choose one...", panswers, ppages, variables, this.props.messages)}</option>
          {this
            .state
            .srcOrder
            .map((rto) => {
              let rt = rto.choice,
                idx = rto.originalPosition;
              return <option key={Keymaker(idx + '_' + rt)} value={idx}>{piper.pipe(rt, panswers, ppages, variables, ctx.props.messages)}</option>
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