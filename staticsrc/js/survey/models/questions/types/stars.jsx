import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {changeAnswer} from '../../../../actions';

/**
* Represents a question
*/
class StarsRatingQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.state = {
      hoverNumber: -1
    };
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
      hoverNumber = this.state.hoverNumber;
    let ctx = this;
    let answer = this.props.answer || 0;
    return (
      <div className="question--rating stars">
        <div
          className="buttongroup"
          onMouseLeave={this
          .handleHoverLeave
          .bind(this)}>
          {ratingScale.map((rt, idx) => {
            return <label
              key={idx}
              data-which={idx}
              onMouseEnter={this
              .handleStarHover
              .bind(this)}
              className={"star--button fa fa-star" + (!!(rt <= answer)
              ? " selected"
              : "") + (hoverNumber >= idx ? " hovered " : "")}>
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