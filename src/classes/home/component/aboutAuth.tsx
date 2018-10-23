import * as React from 'react'
import Card from 'antd/lib/card'

export interface IAboutAuthProps {
  
}

export default class AboutAuth extends React.Component<IAboutAuthProps> {
  render() {
    return (
      <Card
        title="Card title"
        bordered={false}>
        Card content
      </Card>
    )
  }
}
