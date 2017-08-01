import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class MatrixRatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0,
      animatingForward: false,
      animatingBackward: false
    };
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    /* let targ = e && e.target,
      root = ReactDOM.findDOMNode(this),
      ipts = root.getElementsByClassName("main--textfield");
    this.props.dispatch(changeAnswer(this.props.name, ipts[0].value));*/
  }

  /**
   * Go back
   * @param {*} e
   */
  retreatCarousel(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.state.selectedItem > 0 && !this.state.animatingBackward && !this.state.animatingForward) {
      // do it
      this.setState({animatingBackward: true, animatingForward: false});
    }
  }

  /**
   * Advance
   * @param {*} e
   */
  advanceCarousel(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.state.selectedItem < (this.props.choices.length - 1) && !this.state.animatingBackward && !this.state.animatingForward) {
      // do it
      this.setState({animatingBackward: false, animatingForward: true});
    }
  }

  /**
   * Animation ended
   * @param {*} e
   */
  handleAnimationEnd(e) {
    let targ = e.target;
    if (targ.className.indexOf('choiceitem') > -1) {
      if (this.state.animatingForward) {
        clearTimeout(this.stopAnimationTimer);
        this.stopAnimationTimer = setTimeout(() => {
          this.setState({
            animatingBackward: false,
            animatingForward: false,
            selectedItem: this.state.selectedItem + 1
          });
        }, 250);
      } else if (this.state.animatingBackward) {
        clearTimeout(this.stopAnimationTimer);
        this.stopAnimationTimer = setTimeout(() => {
          this.setState({
            animatingBackward: false,
            animatingForward: false,
            selectedItem: this.state.selectedItem - 1
          });
        }, 250);
      }
    }
  }

  /**
 * Render the view
 */
  render() {
    let qname = this.props.name;
    let ratingScale = [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ];
    let ctx = this,
      selectedItem = this.state.selectedItem,
      animatingBackward = this.state.animatingBackward,
      animatingForward = this.state.animatingForward,
      answer = 0;
    return (
      <div
        className="question--matrixrating"
        onTransitionEnd={this
        .handleAnimationEnd
        .bind(this)}>
        <div className="matrix--carousel">
          {this
            .props
            .choices
            .map((rt, idx) => {
              return <div
                key={idx}
                className={"choiceitem" + (selectedItem == idx
                ? " selected"
                : "") + (selectedItem == (idx + 1)
                ? " prevselected"
                : "") + (selectedItem == (idx - 1)
                ? " nextselected"
                : "") + ((selectedItem == (idx + 1) && animatingBackward)
                ? " abPrevSelected"
                : "") + ((selectedItem == idx && animatingForward)
                ? " afSelected"
                : "") + ((selectedItem == idx && animatingBackward)
                ? " abSelected"
                : "") + ((selectedItem == (idx - 1) && animatingForward)
                ? " afNextSelected"
                : "") + ((selectedItem == (idx + 1) && animatingBackward)
                ? " afPrevSelected"
                : "")}>
                <div className="choiceinner">{rt}</div>
              </div>
            })}
          <a
            href="#"
            className={"carousel--control left fa fa-chevron-left" + (selectedItem > 0
            ? " visible"
            : "")}
            title="Previous"
            onClick={this
            .retreatCarousel
            .bind(this)}></a>
          <a
            href="#"
            className={"carousel--control right fa fa-chevron-right" + (selectedItem < (this.props.choices.length - 1)
            ? " visible"
            : "")}
            title="Next"
            onClick={this
            .advanceCarousel
            .bind(this)}></a>
        </div>
        <div className="rating-zone">
          <div className="question--rating">
            <div className="buttongroup">
              {ratingScale.map((rt, idx) => {
                return <label
                  key={idx}
                  className={"selectbutton question--ratingitem" + (!!(rt <= answer)
                  ? " selected"
                  : "")}>{rt}<input
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
        </div>
      </div>
    );
  }
}

// Connect the component
const ConnectedMatrixRatingQuestion = connect()(MatrixRatingQuestion)

// Expose the question
export default ConnectedMatrixRatingQuestion;