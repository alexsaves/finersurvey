import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import PageComponent from '../models/page.jsx';
import Validator from './validator.js';
import {nextPage} from '../../actions';

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
      showValidation: false
    };
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
      this.props.dispatch(nextPage());
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
    
    pageObj.elements.forEach((elm) => {
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
 * Render the view
 */
  render() {
    let currentPage = this.props.currentPage,
      answers = this.props.answers;
    return (
      <div className="paginator">
        {this.state.showValidation && <div className={"validation--holder " + (this.state.showValidation ? "visible " : "") + (currentPage === (this.props.pages.length - 1) ? "hidden": "")}><div className="validationcontainer"><div className="rightarrow"></div>This question is required.</div></div>}
        {this.props.pages.map((pg, idx) => {
          return <PageComponent key={idx} questions={pg.elements} isSelected={idx === currentPage} answers={answers} />;
        })}
        <div className={"paginator--backdropmobile"}></div>
        <div className={"paginator--buttonholder left " + (currentPage === 0 ? "hidden": "")}><a className="paginator--button" title="Previous page">&lt;</a></div>        
        <div className={"paginator--buttonholder right " + (currentPage === (this.props.pages.length - 1) ? "hidden": "")}><a className="paginator--button" title="Next page" onClick={this.handleAdvanceRequest.bind(this)}>&gt;</a></div>
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