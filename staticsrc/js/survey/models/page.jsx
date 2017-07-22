import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import QuestionComponent from './questions/question.jsx';

/**
* Represents the entire survey
*/
class PageComponent extends React.Component {
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
    return (
      <div className={"page " + (this.props.isSelected ? "selected" : "")}>
        The Page
        {this.props.questions.map((q, idx) => {
          return <QuestionComponent key={idx} model={q} />
        })}
      </div>
    );
  }
}

// Expose the connected page
export default PageComponent;