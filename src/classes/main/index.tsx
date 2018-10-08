import * as React from 'react'
import { Route, match, Link, Switch, Redirect } from 'react-router-dom'
import Navbar from '../navbar'
import Setting from '../setting'
import Home from '../home'

interface IMainProps {
  match?: match;
  history: History;
}

class Main extends React.Component<IMainProps> {
  render() {
    const { match } = this.props
    return (
      <div>
        <Navbar />
        <Switch>
          <Route path="/s" exact component={Setting} />
          <Route path="/" exact component={Home} />
          <Redirect to="/404" />
        </Switch>
      </div>
    )
  }
}

export default Main