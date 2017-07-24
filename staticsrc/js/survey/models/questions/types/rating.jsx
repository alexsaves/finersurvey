import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

/**
* Represents a question
*/
class RatingQuestion extends React.Component {
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
    console.log("rating", this.props);
    let qname = this.props.name;
    let ratingScale = [1,2,3,4,5,6,7]; 
    return (
      <div className="question--rating">
        {ratingScale.map((rt, idx) => {
          return <label key={idx} className={"question--ratingitem"}>{rt}<input type="checkbox" name={qname} value={rt} /></label>
        })}
      </div>
    );
  }
}

// Expose the question
export default RatingQuestion;