import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import './App.css';
import AllProjects from './AllProjects'
import NewProject from './NewProject'
import EditProject from './EditProject'
import ViewProject from './ViewProject'


class App extends Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <div class="columns navbar-container">
            <div class="column">
              <button class="button is-medium is-fullwidth is-info"><Link to="/">
                <span class="icon is-small">
                  <i class="fa fa-bars"></i>
                </span> View All Projects
              </Link></button>
            </div>
            <div class="column">
              <button class="button is-medium is-fullwidth is-info"><Link to="/newproject">
                <span class="icon is-small">
                  <i class="fa fa-plus"></i>
                </span> Add New Project
              </Link></button>
            </div>
          </div>
          <Route exact path="/" component={AllProjects} />
          <Route path="/newproject" component={NewProject} />
          <Route path="/project/:id" component={EditProject} />
          <Route path="/projectview/:id" component={ViewProject} />

        </div>
      </Router>
    );
  }
}
export default App;