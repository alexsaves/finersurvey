import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

/**
* Shows a missing page UI
*/
class MissingPageController extends React.Component {
  /**
 * Constructor for the message
 */
  constructor(props) {
    super(props);
  }

  /**
 * Render the view
 */
  render() {
    return (
      <div className="paginator">
        <div className="page selected">
          <div className="questions">
            <div className="questions--listholder">
              <div className="question">
                <h2>{this.props.messages.pageNotFound}</h2>
                <p className="subtitle">{this.props.messages.startOver}</p>
                <div className="question--buttons">
                  <Link to={"/s/" + this.props.metadata.guid} tabIndex={1} className="btn green">{this.props.messages.ok}</Link>
                </div>
              </div>
            </div>
          </div>
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
    messages: state.messages
  };
}

// Connect the component
const ConnectedMissingPageController = connect(mapStateToProps)(MissingPageController);

// Expose the message UI
export default ConnectedMissingPageController;