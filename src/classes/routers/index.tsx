import * as React from 'react'
import createHistory from 'history/createBrowserHistory'
import { Router, Route } from 'react-router-dom'
import Navbar from '../navbar'

export default class Routers extends React.Component{
  render() {
    return (
      <Router history={createHistory()}>
        <div>
          <Route path="/" component={Navbar} />
        </div>
      </Router>
    )
  }
}
