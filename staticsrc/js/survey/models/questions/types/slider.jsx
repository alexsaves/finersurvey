import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class SliderRatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 50,
      startScreenX: 0,
      startScreenY: 0,
      isDragging: false,
      didSetSliderFromAnswer: false
    };
  }

  /**
   * Mobile drag start
   * @param {*} e
   */
  handleMobileDragStart(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.log("mobile drag start");
  }

  /**
   * Desktop drag start
   * @param {*} e
   */
  handleMouseDragStart(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    var root = ReactDOM.findDOMNode(this),
      ball = root.getElementsByClassName("slider--ball")[0];
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
    window.addEventListener('mousemove', this.proxyDM);
    window.addEventListener('mouseup', this.proxySD);
    window.addEventListener('mouseleave', this.proxySD);
  }

  /**
   * Stop dragging
   * @param {*} e
   */
  dropDrag(e) {
    window.removeEventListener('mousemove', this.proxyDM);
    window.removeEventListener('mouseup', this.proxySD);
    window.removeEventListener('mouseleave', this.proxySD);
    this.setState({isDragging: false});
    this
      .props
      .dispatch(changeAnswer(this.props.name, this.state.sliderValue));
  }

  /**
   * The mouse or touch is moving
   * @param {*} e
   */
  handleDragMove(e) {
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
    return (
      <div className="question--rating slider">
        <div className="slider--container">
          <div className="slider--backdrop"></div>
          <div
            className={"slider--ball" + (this.state.isDragging
            ? " dragging"
            : "")}
            style={{
            left: sliderValue + '%'
          }}
            onTouchStartCapture={this
            .handleMobileDragStart
            .bind(this)}
            onMouseDownCapture={this
            .handleMouseDragStart
            .bind(this)}></div>
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