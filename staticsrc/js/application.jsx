import React from 'react';
import RoutesComponent from './routes.jsx';

/**
 * Represents the top level of the application
 */
export default class Application extends React.Component {
  /**
 * Constructor for the finish signup component
 */
  constructor(props) {
    super(props);
  }

  /**
   * Render the UI
   */
  render() {
    return (<RoutesComponent/>);
  }
}
