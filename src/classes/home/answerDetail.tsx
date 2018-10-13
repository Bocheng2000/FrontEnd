import * as React from 'react'
import { match } from 'react-router-dom'

export interface IAnswerDetailProps {
  match?: match
}

class AnswerDetail extends React.Component<IAnswerDetailProps> {
  render() {
    return (
      <div>aaa</div>
    )
  }
}

export default AnswerDetail
