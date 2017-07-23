import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import ProgressComponent from './components/progress.jsx';
import PageController from './components/paginationcontroller.jsx';

/**
* Represents the entire survey
*/
class SurveyComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({progress: Math.random()})
    }, 1000)
  }

  /**
 * Render the view
 */
  render() {    
    return (
      <div className={"app-ui app-main " + this.props.metadata.theme}>
        <ProgressComponent progress={this.state.progress} />
        <PageController />
        <a href="https://www.finer.ink" title="Sales Win/Loss Analysis" target="_blank" className="logo--finerink"></a>      
      </div>
    );
  }
}

// This is our select function that will extract from the state the data slice
// we want to expose through props to our component.
const mapStateToProps = (state/*, props*/) => {
  return {metadata: state.metadata, pages: state.pages, currentPage: state.currentPage}
}

// Connect the survey component
const ConnectedSurveyComponent = connect(mapStateToProps)(SurveyComponent);

// Expose the connected survey
export default ConnectedSurveyComponent;