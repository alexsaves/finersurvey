import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

/**
* Represents a question
*/
class CheckboxQuestion extends React.Component {
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
    let qname = this.props.name;
    return (
      <div className="question--checkbox">
        {this.props.choices.map((rt, idx) => {
            return <label
              key={idx}
              className={"selectbutton "}>{rt}<input
              type="checkbox"
              name={qname}
              value={rt}/></label>
          })}
        {this.props.other === true && <input type="text" className="other--textfield" placeholder={this.props.otherplaceholder || ''} />}
      </div>
    );
  }
}

// Expose the question
export default CheckboxQuestion;