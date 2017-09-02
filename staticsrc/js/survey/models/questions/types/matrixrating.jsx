import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';
import Piper from '../../../components/piper';
import Randomizer from '../../../components/randomizer';

/**
* Represents a question
*/
class MatrixRatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.Randomizer = new Randomizer();
    this.wasFocused = false;
    this.state = {
      selectedItem: 0,
      animatingForward: false,
      animatingBackward: false,
      answers: [],
      srcOrder: this
        .Randomizer
        .randomizeChoices(this.props.choices, this.props.random)
    };
    for (let i = 0; i < this.props.choices.length; i++) {
      this.state.answers[i] = -1;
    }
    let answers = this.props.answers;
    if (answers && answers[props.name]) {
      this.state.answers = answers[props.name].slice(0);
    }
    this.piper = new Piper();
  }

  /**
   * Handle input from the user
   * @param {*} e
   */
  handleAnswerChange(e) {
    let targ = e && e.currentTarget,
      newAnswers = this
        .state
        .answers
        .slice(0);
    newAnswers[this.state.srcOrder[this.state.selectedItem].originalPosition] = parseInt(targ.value);
    this.setState({answers: newAnswers});
    this
      .props
      .dispatch(changeAnswer(this.props.name, newAnswers));
    if (this.state.selectedItem < this.props.choices.length - 1) {
      this.advanceCarousel(e);
    }
    if (this.state.selectedItem == this.props.choices.length - 1) {
      if (this.props.onFullyAnswerQuestion) {
        this
          .props
          .onFullyAnswerQuestion();
      }
    }
    // Signal that the user is interacting with the question
    if (this.props.onQuestionBeingInteractedWith) {
      this
        .props
        .onQuestionBeingInteractedWith();
    }
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
        }, 150);
      } else if (this.state.animatingBackward) {
        clearTimeout(this.stopAnimationTimer);
        this.stopAnimationTimer = setTimeout(() => {
          this.setState({
            animatingBackward: false,
            animatingForward: false,
            selectedItem: this.state.selectedItem - 1
          });
        }, 150);
      }
    }
  }

  /**
   * User clicked on a specific page
   * @param {*} e
   */
  handlePaginationClick(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    let targ = e.currentTarget,
      which = parseInt(targ.getAttribute("data-which"));

    this.setState({selectedItem: which});
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
      answer = (this.props.answer && this.props.answer[this.state.srcOrder[this.state.selectedItem].originalPosition]) || null,
      piper = this.piper,
      panswers = this.props.answers,
      ppages = this.props.allpages;

    if (this.props.isFocused && !this.wasFocused) {
      setTimeout(() => {
        this.wasFocused = true;
        let root = ReactDOM.findDOMNode(this),
          btns = root.getElementsByClassName('selectbutton');
        if (btns.length > 0) {
          btns[0].focus();
        }
      }, 100);
    }

    // Spit out the question node
    return (
      <div
        className="question--matrixrating"
        onTransitionEnd={this
        .handleAnimationEnd
        .bind(this)}>
        <div className="matrix--carousel">
          {this
            .state
            .srcOrder
            .map((rto, idxo) => {
              let rt = rto.choice,
                idx = rto.originalPosition;
              return <div
                key={idx}
                className={"choiceitem" + (selectedItem == idxo
                ? " selected"
                : "") + (selectedItem == (idxo + 1)
                ? " prevselected"
                : "") + (selectedItem == (idxo - 1)
                ? " nextselected"
                : "") + ((selectedItem == (idxo + 1) && animatingBackward)
                ? " abPrevSelected"
                : "") + ((selectedItem == idxo && animatingForward)
                ? " afSelected"
                : "") + ((selectedItem == idxo && animatingBackward)
                ? " abSelected"
                : "") + ((selectedItem == (idxo - 1) && animatingForward)
                ? " afNextSelected"
                : "") + ((selectedItem == (idxo + 1) && animatingBackward)
                ? " afPrevSelected"
                : "")}>
                <div className="choiceinner">{piper.pipe(rt, panswers, ppages)}</div>
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
        {this.state.srcOrder.length > 1 && this.props.paginationControl !== false && <div className="pagination--controls">
          {this
            .state
            .srcOrder
            .map((rto, idxo) => {
              return <a
                href="#"
                data-which={idxo}
                key={"_" + idxo}
                className={(selectedItem == idxo
                ? "selected"
                : "")}
                onClick={this
                .handlePaginationClick
                .bind(this)}></a>;
            })}
        </div>}
        <div className="rating-zone">
          <div className="question--rating">
            <div className="buttongroup">
              {ratingScale.map((rt, idx) => {
                return <label
                  key={idx}
                  onKeyPress={this
                  .handleKeyPress
                  .bind(this)}
                  tabIndex={(ctx.props.pageNumber * 1000) + ctx.props.questionNumber}
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
const ConnectedMatrixRatingQuestion = connect()(MatrixRatingQuestion);

// Expose the question
export default ConnectedMatrixRatingQuestion;