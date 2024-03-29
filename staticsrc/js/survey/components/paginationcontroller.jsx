import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PageComponent from '../models/page.jsx';
import Validator from './validator';
import Keymaker from './keymaker';
import { nextPage, prevPage, jumpToPage } from '../../actions';
import { Link } from 'react-router-dom';

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
      animatingBackward: false,
      previousPaginationVisibility: false,
      remindInstructionsFor: []
    };
  }

  /**
   * Animate to the next page
   */
  animateForward() {
    this.setState({ animatingForward: true });
  }

  /**
   * Animate to the previous page
   */
  animateBackward() {
    this.setState({ animatingBackward: true });
  }

  /**
   * If validation exists, cancel it
   */
  cancelValidation() {
    clearTimeout(this._advanceTimer);
    this.setState({ showValidation: false });
  }

  /**
   * Clean up stuff
   */
  componentWillUnmount() {
    clearTimeout(this.advancejump);
    clearTimeout(this._advanceTimer);
    clearTimeout(this._autoAdvance);
    clearTimeout(this._int);
  }

  /**
   * Handle advancing
   */
  handleAdvanceRequest(e) {
    if (this.props.currentPage == this.props.pages.length - 1) {
      e.preventDefault();
      return;
    }
    let failedValidationItems = this.hasRequiredAnswersForPage(this.props.currentPage),
      validated = failedValidationItems.length === 0;
    this.setState({ showValidation: false, remindInstructionsFor: [] });
    if (!validated) {
      this._advanceTimer = setTimeout(() => {
        this.setState({ showValidation: true, remindInstructionsFor: failedValidationItems });
      }, 20);
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
    } else {
      this.animateForward();
    }
  }

  /**
   * Handle previous page
   */
  handlePreviousRequest(e) {
    if (this.props.currentPage > 0) {
      this.animateBackward(() => {
        this
          .props
          .dispatch(prevPage());
      });
    } else {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

  /**
   * Do we have required answers for the question
   * @param {Number} pageNumber
   */
  hasRequiredAnswersForPage(pageNumber) {
    let pageObj = this.props.pages[pageNumber],
      answers = this.props.answers,
      validator = new Validator(),
      faledQList = [];

    if (pageObj) {
      pageObj
        .elements
        .forEach((elm) => {
          if (elm.required) {
            // Required question
            let theanswer = answers[elm.name];
            if (typeof theanswer == 'undefined') {
              faledQList.push(elm.name);
            } else {
              if (!validator.validate(elm, theanswer)) {
                faledQList.push(elm.name);
              }
            }
          }
        });
    }

    return faledQList;
  }

  /**
   * Does this page qualify for auto-advance?
   * @param {*} pageNumber
   */
  pageCanAutoAdvance(pageNumber) {
    let pageObj = this.props.pages[pageNumber],
      howmanyrealquestions = 0;

    if (pageNumber == this.props.pages.length - 1) {
      return false;
    }

    pageObj
      .elements
      .forEach((pg) => {
        if (pg.type != "none" && pg.type != "buttons" && pg.type != "button") {
          howmanyrealquestions++;
        }
      });

    if (howmanyrealquestions < 2) {
      return pageObj
        .elements
        .find((elm) => {
          let qt = elm.type;
          return (qt == "none" || qt == "multitext" || qt == "rating" || qt == "matrixrating" || qt == "matrixradio" || qt == "dropdown" || qt == "radio" || qt == "text" || qt == "buttons" || qt == "button")
        });
    }
    return false;
  }

  /**
   * Animation is over
   */
  handleAnimationEnd(e) {
    let targ = e.target;
    if (targ.className.indexOf('page') > -1) {
      this.setState({ animatingForward: false, animatingBackward: false });
      if (this.state.animatingForward) {
        this
          .props
          .dispatch(nextPage());
      } else if (this.state.animatingBackward) {
        this
          .props
          .dispatch(prevPage());
      }
    } else if (targ.className.indexOf("instructions") > -1) {
      this.setState({ remindInstructionsFor: [] });
    }
  }

  /**
   * Handle when a question is fully answered
   */
  handleFullyAnswerQuestion() {
    clearTimeout(this._autoAdvance);
    this._autoAdvance = setTimeout(() => {
      if (this.pageCanAutoAdvance(this.props.currentPage)) {
        this._int = setTimeout(() => {
          let root = ReactDOM.findDOMNode(this),
            advanceButton = root.getElementsByClassName('advance--button')[0];
          var evObj = document.createEvent('MouseEvents');
          evObj.initMouseEvent('click', true, true, window, 1, 12, 345, 7, 220, false, false, false, false, 0, null);
          advanceButton.dispatchEvent(evObj);
        }, 200);
      }
    }, 25);
  }

  /**
   * Handle when a question is interacted with
   * @param {*} idx
   */
  questionBeingInteractedWith() { }

  /**
 * Render the view
 */
  render() {
    let currentPage = this.props.currentPage,
      answers = this.props.answers,
      pages = this.props.pages,
      allpages = this.props.allpages,
      messages = this.props.messages,
      variables = this.props.variables,
      hidePagination = currentPage < 0 || pages.length == 0 || currentPage > pages.length - 1 || !!pages[currentPage].hidePagination,
      isAnimatingForward = this.state.animatingForward,
      isAnimatingBackward = this.state.animatingBackward,
      remindInstructionsFor = this.state.remindInstructionsFor,
      failedValidationItems = this.hasRequiredAnswersForPage(this.props.currentPage),
      isValidated = failedValidationItems.length === 0,
      desiredPage = (typeof this.props.desiredPage != 'undefined')
        ? parseInt(this.props.desiredPage) - 1
        : 0;

    if (!this.state.animatingBackward && !this.state.animatingForward && desiredPage != this.props.currentPage) {
      clearTimeout(this.advancejump);
      this.advancejump = setTimeout(() => {
        this
          .props
          .dispatch(jumpToPage(Math.max(0, desiredPage)));
      }, 20);
    }
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
            <div className="rightarrow"></div>{this.props.messages.requiredQ}</div>
        </div>}
        {pages.map((pg, idx) => {
          return <PageComponent
            key={Keymaker(idx + pg.name)}
            questions={pg.elements}
            isSelected={idx === currentPage}
            remindInstructionsFor={remindInstructionsFor}
            answers={answers}
            messages={messages}
            allpages={allpages}
            variables={variables}
            pageNumber={idx}
            onQuestionBeingInteractedWith={this
              .questionBeingInteractedWith
              .bind(this)}
            onFullyAnswerQuestion={this
              .handleFullyAnswerQuestion
              .bind(this)}
            animatingOutBackward={idx === currentPage && isAnimatingBackward}
            animatingOutForward={idx === currentPage && isAnimatingForward}
            animatingInBackward={idx === (currentPage - 1) && isAnimatingBackward}
            animatingInForward={idx === (currentPage + 1) && isAnimatingForward} />;
        })}
        <div
          className={"paginator--backdropmobile" + (hidePagination
            ? " hidden"
            : "")}></div>
        <div
          className={"paginator--buttonholder left " + ((currentPage === 0 || hidePagination)
            ? "hidden"
            : "")}>
          <Link
            to={"/s/" + this.props.uid + "/" + (currentPage)}
            className="paginator--button"
            title={this.props.messages.prevPage}
            onClick={this
              .handlePreviousRequest
              .bind(this)}>&lt;</Link>
        </div>
        <div
          className={"paginator--buttonholder right " + (((currentPage === (this.props.pages.length - 1)) || hidePagination)
            ? "hidden"
            : "")}>
          <Link
            to={"/s/" + this.props.uid + "/" + (currentPage + 2)}
            className={"paginator--button advance--button " + (isValidated
              ? "validated"
              : "")}
            title={this.props.messages.nextPage}
            onMouseOut={this
              .cancelValidation
              .bind(this)}
            onClick={this
              .handleAdvanceRequest
              .bind(this)}>&gt;</Link>
        </div>
      </div>
    );
  }
}

// This is our select function that will extract from the state the data slice
// we want to expose through props to our component.
const mapStateToProps = (state/*, props*/) => {
  return {
    metadata: state.metadata,
    pages: state.validatedPages,
    allpages: state.pages,
    currentPage: state.currentPage,
    answers: state.answers,
    variables: state.variables,
    messages: state.messages,
    paginationControllerVisibility: state.paginationControllerVisibility
  };
}

// Connect the survey component
const ConnectedPaginationController = connect(mapStateToProps)(PaginationController);

// Expose the connected survey
export default ConnectedPaginationController;