import React from 'react';
import {connect} from 'react-redux';
import Piper from '../../../components/piper';

/**
* Represents a link
*/
class LinkQuestion extends React.Component {
  /**
 * Constructor for the survey
 */
  constructor(props) {
    super(props);
    this.piper = new Piper();
  }

  /**
   * The component mounted
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * Component is unmounting
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
 * Render the view
 */
  render() {
    let targ = null;

    if (this.props.modifier && this.props.modifier.toLowerCase() == "new") {
      targ = "_blank";
    }

    // Spit out the node
    return (
      <div className={"question--link"}>
        <a href={this.props.link.url} target={targ}>{this.props.link.title}</a>
      </div>
    );
  }
}

// Connect the component
const ConnectedLinkQuestion = connect()(LinkQuestion)

// Expose the question
export default ConnectedLinkQuestion;