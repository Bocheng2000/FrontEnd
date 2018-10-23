import * as React from 'react'
import { Route, match, Switch, Redirect } from 'react-router-dom'
import Navbar from '../navbar'
import Setting from '../setting'
import Home from '../home'
import PostDetail from '../home/postDetail'
import AnswerDetail from '../home/answerDetail'


class Main extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          {/* <Route path="/t/:id" exact component={Setting} /> */}
          {/* <Route path="/t" exact component={Setting} /> */}
          <Route path="/p/:id" component={PostDetail} /> {/*等待实现*/}
          <Route path="/q/:qid/:aid" component={AnswerDetail} /> {/*等待实现*/}
          {/* <Route path="/q/:qid" component={AnswerDetail} /> 等待实现 */}
          <Route path="/s" exact component={Setting} />
          <Route path="/" exact component={Home} />
          {/* <Route path="/u/:id" component={PostDetail} /> 等待实现 */}
          <Redirect to="/404" />
        </Switch>
      </div>
    )
  }
}

export default Main