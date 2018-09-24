import * as React from 'react'
import { ESystemTheme } from '../../../reducer/main'

export interface ILoadingProps {
  mode?: ESystemTheme
}

class Loading extends React.Component<ILoadingProps> {
  render() {
    const { mode } = this.props
    const color = mode === ESystemTheme.night ? '#545454' : '#c8c8c8'
    return (
      <div id="loading">
        <div
          className="cell1"
          style={{ background: color }}
        />
        <div
          className="cell2"
          style={{ background: color }}
        />
        <div
          className="cell3"
          style={{ background: color }}
        />
      </div>
    )
  }
}

export default Loading