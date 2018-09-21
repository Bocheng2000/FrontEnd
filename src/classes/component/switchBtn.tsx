import * as React from 'React'
import { EFontColor } from '../../reducer/main'

export interface ISwitchData {
  title: string;
  high: boolean;
  style?: object;
  handler?: (e?: React.MouseEvent) => void;
}

interface ISwitchBtnProps {
  color?: EFontColor;
  data?: Array<ISwitchData>
}

export default class SwitchBtn extends React.Component<ISwitchBtnProps> {
  render() {
    const { color, data } = this.props
    if (!data) {
      return null
    }
    return (
      <div id="switch-container">
        {
          data.map((e, i) => {
            let s = null
            let high = ''
            if (!e.high) {
              s = { color: '#969696' }
            } else {
              high = 'high'
            }
            if (i === 0) {
              return (
                <span
                  key={e.title}
                  className={`option left ${high}`}
                  style={{ ...s, ...e.style }}
                  onClick={(t) => e.handler && !e.high && e.handler(t)}
                >
                  {e.title}
                </span>
              )
            }
            if (i === data.length - 1) {
              return (
                <span
                  key={e.title}
                  className={`option right ${high}`}
                  style={{ ...s, ...e.style }}
                  onClick={(t) => e.handler && !e.high && e.handler(t)}
                >
                  {e.title}
                </span>
              )
            }
            return (
              <span
                key={e.title}
                className={`option middle ${high}`}
                style={{ ...s, ...e.style }}
                onClick={(t) => e.handler && !e.high && e.handler(t)}
              >
                {e.title}
              </span>
            )
          })
        }
      </div>
    )
  }
}