import * as React from 'react'

export interface ILoadingProps {
  container?: object
}

export default class Loading extends React.Component<ILoadingProps> {
  render() {
    const { container = {} } = this.props
    return (
      <div id="loading-point" style={container}>
        <div className="conteiner" />
      </div>
    )
  }
}
