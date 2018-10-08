import * as React from 'react'
import { ESystemTheme } from '../../../reducer/main'

export interface IPostLoadingProps {
  mode?: ESystemTheme
}

export default class PostLoading extends React.Component<IPostLoadingProps> {
  render() {
    const { mode } = this.props
    const color = mode === ESystemTheme.night ? '#545454' : '#c8c8c8'
    return (
      <div
        id="loading"
        style={{
          borderTop: `1px solid ${color}`,
          padding: '10px 0',
        }}>
        <div className="item">
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
          <div className="cell-tools">
            <div className="i" style={{ background: color }} />
            <div className="i" style={{ background: color }} />
            <div className="i" style={{ background: color }} />
            <div className="i" style={{ background: color }} />
          </div>
        </div>
        <div className="cell-image" style={{ background: color }}/>
      </div>
    )
  }
}
