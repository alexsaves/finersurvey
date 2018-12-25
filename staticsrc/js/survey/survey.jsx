import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import ProgressComponent from './components/progress.jsx';
import PageController from './components/paginationcontroller.jsx';
import LoadingScreen from './components/loadingscreen.jsx';
import MissingPageMessage from './components/missingpagemessage.jsx';
import { changeIsNewStatus } from '../actions';
import { Link } from 'react-router-dom';
import { validateSurvey } from '../actions/index';

/**
* Represents the entire survey
*/
class SurveyComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.state = {
      isOverflowing: false,
      hideLoadingScreen: false,
      didShowLoadingScreen: false
    };
  }

  /**
   * Get the location from the URL
   */
  getCurrentLocation() {
    var bits = window.location.pathname.split('/');
    return {
      pg: parseInt(bits[bits.length - 1], 10),
      uid: bits[bits.length - 2]
    };
  }

  /**
   * The UI has mounted
   */
  componentDidMount() {
    console.log("SURVEY MOUNTED");
    this.updateOverflowStatus();
    // Only let it be new once
    if (this.props.isNew) {
      this
        .props
        .dispatch(changeIsNewStatus(false));
      let pgs = this.props.pages;
      if (this.props.currentPage >= 0 && this.props.currentPage < pgs.length) {
        if (pgs[this.props.currentPage].isStartable !== true) {
          let root = ReactDOM.findDOMNode(this),
            restarter = root.getElementsByClassName("resetSurveyLink")[0];
          var evObj = document.createEvent('MouseEvents');
          evObj.initMouseEvent('click', true, true, window, 1, 12, 345, 7, 220, false, false, false, false, 0, null);
          restarter.dispatchEvent(evObj);
        }
      }
    }

    this.props.dispatch(validateSurvey());
  }

  /**
   * Update whether or not the Y axis is overflowing
   */
  updateOverflowStatus() {
    let surveyNode = document.getElementsByClassName("survey")[0],
      isOverflowing = surveyNode.scrollHeight > surveyNode.offsetHeight;
    if (isOverflowing != this.state.isOverflowing) {
      this.setState({ isOverflowing: isOverflowing });
    }
  }

  /**
   * Deal with the transition end
   */
  handleTransitionEnd(e) {
    let targ = e.target;
    if (targ.className.indexOf('loading--container') > -1) {
      this.setState({ hideLoadingScreen: true });
    }
  }

  /**
 * Render the view
 */
  render() {
    let pageInfo = this.getCurrentLocation(),
      uid = pageInfo.uid,
      desiredPage = pageInfo.pg || 0,
      pages = this.props.pages,
      hideLogo = false,
      showMissingPageUI = false,
      showingLoadingScreen = !this.state.hideLoadingScreen;

    if (desiredPage > pages.length) {
      showMissingPageUI = true;
    }

    if (!showMissingPageUI && this.props.currentPage >= 0 && this.props.pages && this.props.pages.length > 0) {
      hideLogo = this.props.currentPage < this.props.pages.length
        ? !!this.props.pages[this.props.currentPage].hideLogo
        : true;
    }
    console.log("SHOWING LOADING?", showingLoadingScreen);
    // Spit out the survey
    return (
      <div
        className={"survey" + (this.state.isOverflowing
          ? " overflowing"
          : "")}
        onTransitionEnd={this
          .handleTransitionEnd
          .bind(this)}>
        {!showMissingPageUI && <ProgressComponent uid={uid} progress={desiredPage / this.props.pages.length} />}
        {!showMissingPageUI && pages.length > 0 && <PageController uid={uid} desiredPage={desiredPage} />}
        {showMissingPageUI && <MissingPageMessage />}
        <div
          title={this.props.messages.winLossAnalysis}
          target="_blank"
          className={"logo--finerink" + (hideLogo
            ? " hidden"
            : "")}></div>
        {showingLoadingScreen && <LoadingScreen />}
        <Link to={"/s/" + uid} aria-hidden="true" className="resetSurveyLink"></Link>
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
    currentPage: state.currentPage,
    variables: state.variables,
    messages: state.messages,
    loadingComplete: !!state.loadingComplete,
    answers: state.answers,
    isNew: state.isNew
  }
}

// Connect the survey component
const ConnectedSurveyComponent = connect(mapStateToProps)(SurveyComponent);

// Expose the connected survey
export default ConnectedSurveyComponent;