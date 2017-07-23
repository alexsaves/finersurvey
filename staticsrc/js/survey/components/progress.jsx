import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

/**
* Represents the entire survey
*/
class ProgressComponent extends React.Component {
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
    let styleInfo = {
      "width": ((this.props.progress || 0) * 100) + "%"
    };
    return (
      <div className="progress--container">
        <div style={styleInfo}></div>
      </div>
    );
  }
}

// Expose the connected page
export default ProgressComponent;