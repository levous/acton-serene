import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

// Struggling with a weird routing issue
// import { createBrowserHistory } from 'history'
// <Router history={createBrowserHistory()}>
import ContentPackageAdminPage from './containers/managed-content-admin-page'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)


const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const RouterComponent = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/content-page/example">example</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/content-page/:resourceKey" component={ContentPackageAdminPage} />
    </div>
  </Router>
)
export default RouterComponent
