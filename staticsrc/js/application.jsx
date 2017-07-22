import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
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
