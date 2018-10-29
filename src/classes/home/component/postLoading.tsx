import * as React from 'react'
import { ESystemTheme } from '../../../reducer/main'

export interface IPostLoadingProps {
  mode?: ESystemTheme
  style?: object
}

export default class PostLoading extends React.Component<IPostLoadingProps> {
  render() {
    const { mode, style } = this.props
    let color
    let backgroundColor
    if (mode === ESystemTheme.night) {
      color = '#545454'
      backgroundColor = '#3F3F3F'
    } else {
      color = '#c8c8c8'
      backgroundColor = '#FFFFFF'
    }
    return (
      <div
        id="loading"
        style={{
          background: backgroundColor,
          borderTop: `1px solid ${color}`,
          padding: '10px',
          ...style
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
