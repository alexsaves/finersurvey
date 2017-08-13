import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import ProgressComponent from './components/progress.jsx';
import PageController from './components/paginationcontroller.jsx';
import LoadingScreen from './components/loadingscreen.jsx';

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
      hideLoadingScreen: false
    };
  }

  /**
   * The UI has mounted
   */
  componentDidMount() {
    this.updateOverflowStatus();
    setInterval(() => {
      this.setState({
        progress: Math.random()
      })
    }, 1000)
  }

  /**
   * Update whether or not the Y axis is overflowing
   */
  updateOverflowStatus() {
    let surveyNode = document.getElementsByClassName("survey")[0];
    let isOverflowing = surveyNode.scrollHeight > surveyNode.offsetHeight;
    if (isOverflowing != this.state.isOverflowing) {
      this.setState({isOverflowing: isOverflowing});
    }
  }

  /**
   * Deal with the transition end
   */
  handleTransitionEnd(e) {
    let targ = e.target;
    if (targ.className.indexOf('loading--container') > -1) {
      this.setState({hideLoadingScreen: true});
    }    
  }

  /**
 * Render the view
 */
  render() {
    let uid = this.props.match.params.uid,
      desiredPage = this.props.match.params.pg;
    return (
      <div
        className={"survey" + (this.state.isOverflowing
        ? " overflowing"
        : "")}
        onTransitionEnd={this
        .handleTransitionEnd
        .bind(this)}>
        <ProgressComponent uid={uid} progress={this.state.progress}/>
        <PageController uid={uid} desiredPage={desiredPage}/>
        <a
          href="https://www.finer.ink"
          title="Sales Win/Loss Analysis"
          target="_blank"
          className="logo--finerink"></a>
        {!this.state.hideLoadingScreen && <LoadingScreen loadingComplete={this.props.loadingComplete}/>}
      </div>
    );
  }
}

// This is our select function that will extract from the state the data slice
// we want to expose through props to our component.
const mapStateToProps = (state/*, props*/) => {
  return {
    metadata: state.metadata,
    pages: state.pages,
    currentPage: state.currentPage,
    loadingComplete: !!state.loadingComplete
  }
}

// Connect the survey component
const ConnectedSurveyComponent = connect(mapStateToProps)(SurveyComponent);

// Expose the connected survey
export default ConnectedSurveyComponent;