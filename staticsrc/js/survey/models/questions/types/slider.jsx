import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';

/**
* Represents a question
*/
class SliderRatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.wasFocused = false;
    this.state = {
      sliderValue: this.props.answer || 50,
      startScreenX: 0,
      startScreenY: 0,
      isDragging: false,
      didSetSliderFromAnswer: false
    };
    this.piper = new Piper();
  }

  /**
   * Desktop drag start
   * @param {*} e
   */
  handleMouseDragStart(e) {
    if (e) {
      e.stopPropagation();
    }
    var root = ReactDOM.findDOMNode(this),
      ball = root.getElementsByClassName("slider--ball")[0];
    if (e.touches && e.touches.length > 0) {
      e = e.touches[0];
    }
    this.setState({
      startScreenX: e.screenX,
      startScreenY: e.screenY,
      ballStartX: ball.offsetLeft,
      ballStartY: ball.offsetTop,
      startSlider: this.state.sliderValue,
      isDragging: true
    });
    this.backdrop = root.getElementsByClassName('slider--backdrop')[0];
    this.proxyDM = this
      .handleDragMove
      .bind(this);
    this.proxySD = this
      .dropDrag
      .bind(this);
    window.addEventListener('touchmove', this.proxyDM);
    window.addEventListener('mousemove', this.proxyDM);
    window.addEventListener('mouseup', this.proxySD);
    window.addEventListener('mouseleave', this.proxySD);
    window.addEventListener('touchcancel', this.proxySD);
    window.addEventListener('touchend', this.proxySD);
  }

  /**
   * Stop dragging
   * @param {*} e
   */
  dropDrag(e) {
    window.removeEventListener('mousemove', this.proxyDM);
    window.removeEventListener('mouseup', this.proxySD);
    window.removeEventListener('mouseleave', this.proxySD);
    window.removeEventListener('touchmove', this.proxyDM);
    window.removeEventListener('touchcancel', this.proxySD);
    window.removeEventListener('touchend', this.proxySD);
    this.setState({isDragging: false});
    this
      .props
      .dispatch(changeAnswer(this.props.name, this.state.sliderValue));
    if (this.props.onFullyAnswerQuestion) {
      this
        .props
        .onFullyAnswerQuestion();
    }
  }

  /**
   * The mouse or touch is moving
   * @param {*} e
   */
  handleDragMove(e) {
    e.preventDefault();
    if (e.touches && e.touches.length > 0) {
      e = e.touches[0];
    }
    let screenX = e.screenX,
      screenY = e.screenY,
      xDiff = this.state.startScreenX - screenX,
      yDiff = this.state.startScreenY - screenY,
      xWidth = this.backdrop.offsetWidth,
      xPerc = xDiff / xWidth;
    this.setState({
      sliderValue: Math.min(100, Math.max(0, this.state.startSlider - (xPerc * 100)))
    });
  }

  /**
   * User tapped on the line specifically
   * @param {*} e
   */
  handleLineTap(e) {
    let root = ReactDOM.findDOMNode(this),
      targ = e.target,
      screenX = e.pageX,
      backdrop = root.getElementsByClassName('slider--backdrop')[0],
      bpos = backdrop.getBoundingClientRect(),
      perc = (screenX - bpos.left) / bpos.width,
      newslidervalue = Math.min(100, Math.max(0, perc * 100));

    this.setState({sliderValue: newslidervalue});
    this
      .props
      .dispatch(changeAnswer(this.props.name, newslidervalue));
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
    let qname = this.props.name,
      ctx = this,
      answer = this.props.answer,
      sliderValue = this.state.sliderValue;
    if (!this.state.didSetSliderFromAnswer && answer) {
      sliderValue = answer;
      setTimeout(() => {
        this.setState({didSetSliderFromAnswer: true});
      }, 20);
    }

    let piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages;

    if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        this.wasFocused = true;
        let root = ReactDOM.findDOMNode(this),
          btns = root.getElementsByTagName('a');
        if (btns.length > 0) {
          btns[0].focus();
        }
      }, 25);
    }

    return (
      <div className="question--rating slider">
        <div className="slider--container">
          <div
            className="slider--backdrop"
            onMouseDownCapture={this
            .handleLineTap
            .bind(this)}></div>
          <a
            className={"slider--ball" + (this.state.isDragging
            ? " dragging"
            : "")}
            tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
            style={{
            left: sliderValue + '%'
          }}
            onTouchStartCapture={this
            .handleMouseDragStart
            .bind(this)}
            onMouseDownCapture={this
            .handleMouseDragStart
            .bind(this)}></a>
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
const ConnectedSliderRatingQuestion = connect()(SliderRatingQuestion)

// Expose the question
export default ConnectedSliderRatingQuestion;