import * as React from 'react'
import { Route, match, Link, Switch, Redirect } from 'react-router-dom'
import Navbar from '../navbar'

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
        {/* <Switch>
          <Redirect to="/404" />
        </Switch> */}
      </div>
    )
  }
}

export default Main