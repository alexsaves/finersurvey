import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import PageComponent from '../models/page.jsx';
import Validator from './validator.js';
import {nextPage, prevPage} from '../../actions';

/**
* Represents the entire survey
*/
class PaginationController extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.state = {
      showValidation: false,
      animatingForward: false,
      animatingBackward: false
    };
  }

  /**
   * Animate to the next page
   */
  animateForward() {
    this.setState({animatingForward: true});
  }

  /**
   * Animate to the previous page
   */
  animateBackward() {
    this.setState({animatingBackward: true});
  }

  /**
   * Handle advancing
   */
  handleAdvanceRequest() {
    let validated = this.hasRequiredAnswersForPage(this.props.currentPage);
    this.setState({showValidation: false});
    if (!validated) {
      setTimeout(() => {
        this.setState({showValidation: true});
      }, 20);
    } else {
      this.animateForward();
    }
  }

  /**
   * Handle previous page
   */
  handlePreviousRequest() {
    if (this.props.currentPage > 0) {
      this.animateBackward(() => {
        this
          .props
          .dispatch(prevPage());
      });
    }
  }

  /**
   * Do we have required answers for the question
   * @param {Number} pageNumber
   */
  hasRequiredAnswersForPage(pageNumber) {
    let pageObj = this.props.pages[pageNumber],
      didPass = true,
      answers = this.props.answers,
      validator = new Validator();

    pageObj
      .elements
      .forEach((elm) => {
        if (elm.required) {
          // Required question
          let theanswer = answers[elm.name];
          if (!theanswer) {
            didPass = false;
          } else {
            if (!validator.validate(elm, theanswer)) {
              didPass = false;
            }
          }
        }
      });

    return didPass;
  }

  /**
   * Animation is over
   */
  handleAnimationEnd(e) {
    let targ = e.target;
    if (targ.className.indexOf('page') > -1) {
      this.setState({animatingForward: false, animatingBackward: false});
      if (this.state.animatingForward) {
        this
          .props
          .dispatch(nextPage());
      } else if (this.state.animatingBackward) {
        this
          .props
          .dispatch(prevPage());
      }
    }
  }

  /**
 * Render the view
 */
  render() {
    let currentPage = this.props.currentPage,
      answers = this.props.answers,
      isAnimatingForward = this.state.animatingForward,
      isAnimatingBackward = this.state.animatingBackward,
      isValidated = this.hasRequiredAnswersForPage(this.props.currentPage);
    return (
      <div
        className="paginator"
        onAnimationEnd={this
        .handleAnimationEnd
        .bind(this)}>
        {this.state.showValidation && <div
          className={"validation--holder " + (this.state.showValidation
          ? "visible "
          : "") + (currentPage === (this.props.pages.length - 1)
          ? "hidden"
          : "")}>
          <div className="validationcontainer">
            <div className="rightarrow"></div>This question is required.</div>
        </div>}
        {this
          .props
          .pages
          .map((pg, idx) => {
            return <PageComponent
              key={idx}
              questions={pg.elements}
              isSelected={idx === currentPage}
              answers={answers}
              animatingOutBackward={idx === currentPage && isAnimatingBackward}
              animatingOutForward={idx === currentPage && isAnimatingForward}
              animatingInBackward={idx === (currentPage - 1) && isAnimatingBackward}
              animatingInForward={idx === (currentPage + 1) && isAnimatingForward}/>;
          })}
        <div className={"paginator--backdropmobile"}></div>
        <div
          className={"paginator--buttonholder left " + (currentPage === 0
          ? "hidden"
          : "")}>
          <a
            className="paginator--button"
            title="Previous page"
            onClick={this
            .handlePreviousRequest
            .bind(this)}>&lt;</a>
        </div>
        <div
          className={"paginator--buttonholder right " + (currentPage === (this.props.pages.length - 1)
          ? "hidden"
          : "")}>
          <a
            className={"paginator--button " + (isValidated
            ? "validated"
            : "")}
            title="Next page"
            onClick={this
            .handleAdvanceRequest
            .bind(this)}>&gt;</a>
        </div>
      </div>
    );
  }
}

// This is our select function that will extract from the state the data slice
// we want to expose through props to our component.
const mapStateToProps = (state/*, props*/) => {
  return {metadata: state.metadata, pages: state.pages, currentPage: state.currentPage, answers: state.answers}
}

// Connect the survey component
const ConnectedPaginationController = connect(mapStateToProps)(PaginationController);

// Expose the connected survey
export default ConnectedPaginationController;