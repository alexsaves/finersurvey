import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import SurveyComponent from './survey/survey.jsx';

/**
 * Handles all the routes
 */
const RoutesComponent = () => {
    return (
        <Switch>
            <Route path="/s/:uid/:pg" component={SurveyComponent}/>
            <Route path="/s/:uid" component={SurveyComponent}/>
        </Switch>
    );
};

// Expose the connected version
export default RoutesComponent;