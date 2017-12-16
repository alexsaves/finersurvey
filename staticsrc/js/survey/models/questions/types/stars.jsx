import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';
import Keymaker from '../../../components/keymaker';

/**
* Represents a question
*/
class StarsRatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
    this.wasFocused = false;
    this.state = {
      hoverNumber: -1
    };
  }

  /**
   * The component mounted
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * The component unmounted
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    let targ = e.currentTarget,
      val = parseInt(targ.value);
    this
      .props
      .dispatch(changeAnswer(this.props.name, val));
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
   * User is overed over a star
   * @param {*} e
   */
  handleStarHover(e) {
    let targ = e.currentTarget,
      hoverNumber = parseInt(targ.getAttribute('data-which'));
    this.setState({hoverNumber: hoverNumber});
  }

  /**
   * The user moused out of the star zone
   * @param {*} e
   */
  handleHoverLeave(e) {
    this.setState({hoverNumber: -1});
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

        cb.checked = !!!cb.checked;
        e.currentTarget = cb;
        this.handleAnswerChange(e);
      }
    }
  }

  /**
 * Render the view
 */
  render() {
    let qname = this.props.name,
      ratingScale = [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      hoverNumber = this.state.hoverNumber,
      ctx = this,
      answer = this.props.answer || 0,
      piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages;

    /*if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        this.wasFocused = true;
        let root = ReactDOM.findDOMNode(this),
          btns = root.getElementsByTagName('label');
        if (btns.length > 0) {
          btns[0].focus();
        }
      }, 25);
    }*/

    return (
      <div className="question--rating stars">
        <div
          className="buttongroup"
          onMouseLeave={this
          .handleHoverLeave
          .bind(this)}>
          {ratingScale.map((rt, idx) => {
            return <label
              key={Keymaker(idx + '_' + rt)}
              tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
              data-which={idx}
              onFocus={this
              .handleStarHover
              .bind(this)}
              onMouseEnter={this
              .handleStarHover
              .bind(this)}
              onKeyPress={this
              .handleKeyPress
              .bind(this)}
              className={"star--button fa fa-star" + (!!(rt <= answer)
              ? " selected"
              : "") + (hoverNumber >= idx
              ? " hovered "
              : "")}>
              <span className={"fa fa-star-o star--inner"}></span><input
                type="checkbox"
                checked={!!(rt <= answer)}
                name={qname}
                value={rt}
                onChange={ctx
              .handleAnswerChange
              .bind(ctx)}/></label>
          })}
        </div>
        <div className="labelcontainer">
          {this.props.low && <span className="smalllabel lowlabel">{this.props.low}</span>}
          {this.props.high && <span className="smalllabel highlabel">{this.props.high}</span>}
        </div>
      </div>
    );
  }
}

// Connect the component
const ConnectedStarsRatingQuestion = connect()(StarsRatingQuestion)

// Expose the question
export default ConnectedStarsRatingQuestion;