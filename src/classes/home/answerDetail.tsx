import * as React from 'react'
import { match } from 'react-router-dom'

export interface IAnswerDetailProps {
  match?: match
}

class AnswerDetail extends React.Component<IAnswerDetailProps> {
  render() {
    console.log((this.props.match.params as any).id)
    return (
      <div>aaa</div>
    )
  }
}

export default AnswerDetail
