import * as React from 'react'
import { match } from 'react-router-dom'

export interface IPostDetailProps {
  match?: match
}

class PostDetail extends React.Component<IPostDetailProps> {
  render() {
    console.log((this.props.match.params as any).id)
    return (
      <div className="base-body">aaa</div>
    )
  }
}

export default PostDetail
