import * as React from 'react'
import createHistory from 'history/createBrowserHistory'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import * as instance from '../../utils/instance'
import Main from '../main'
import Regist from '../regist'
import Login from '../login'
import NotFound from '../notfound'
import Write from '../home/write'


export default class Routers extends React.Component {
  render() {
    const history = createHistory()
    instance.setValueByKey('history', history)
    return (
      <Router history={history}>
        <Switch>
          <Route path="/404" exact component={NotFound} />
          <Route path="/w" component={Write} />
          <Route path="/r" exact component={Regist} />
          <Route path="/l" exact component={Login} />
          <Route path="/" component={Main}/>
        </Switch>
      </Router>
    )
  }
}
