import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import PageComponent from './models/page.jsx';
import ProgressComponent from './components/progress.jsx';

/**
* Represents the entire survey
*/
class SurveyComponent extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
  }

  /**
 * Render the view
 */
  render() {
    console.log(this.props);
    let currentPage = this.props.currentPage;
    return (
      <div className='app-ui app-main'>
        <ProgressComponent />
        {this.props.pages.map((pg, idx) => {
          return <PageComponent key={idx} questions={pg.elements} isSelected={idx === currentPage} />;
        })}
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