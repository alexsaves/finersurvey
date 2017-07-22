import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

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
    return (
      <div className='page'>
        page
      </div>
    );
  }
}

// Expose the connected page
export default PageComponent;