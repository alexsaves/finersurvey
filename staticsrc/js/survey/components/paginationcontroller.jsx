import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import PageComponent from '../models/page.jsx';

/**
* Represents the entire survey
*/
class PaginationController extends React.Component {
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
    let currentPage = this.props.currentPage,
      answers = this.props.answers;
    return (
      <div className="paginator">
        {this.props.pages.map((pg, idx) => {
          return <PageComponent key={idx} questions={pg.elements} isSelected={idx === currentPage} answers={answers} />;
        })}
        <div className={"paginator--backdropmobile"}></div>
        <div className={"paginator--buttonholder left " + (currentPage === 0 ? "hidden": "")}><a className="paginator--button" title="Previous page">&lt;</a></div>
        <div className={"paginator--buttonholder right " + (currentPage === (this.props.pages.length - 1) ? "hidden": "")}><a className="paginator--button" title="Next page">&gt;</a></div>
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