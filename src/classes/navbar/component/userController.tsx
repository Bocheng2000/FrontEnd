import * as React from 'react'
import { EFontFamily, EFontColor, ESystemTheme, ELanguageEnv } from '../../../reducer/main'
import { getFontColor } from '../../../utils/font'
import localWithKey from '../../../language'

export interface IUserControllerProps {
  ref?: (e: UserController) => void
  mode: ESystemTheme
  fontFamily: EFontFamily
  language: ELanguageEnv
  fontColor: EFontColor
  menuClick?: (path: string) => void
}

interface IUserControllerState {
  visible: boolean
}

export default class UserController extends React.Component<IUserControllerProps, IUserControllerState> {
  public show: (left: number) => void
  public hide: () => void
  private timer: any
  private left: number
  constructor(props: IUserControllerProps) {
    super(props)
    this.state = {
      visible: false
    }
    this.show = (left: number) => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      const { visible } = this.state
      this.left = left
      if (!visible) {
        this.setState({ visible: true })
        setTimeout(() => {
          document.getElementById('user-ctrl').style.opacity = "1"
        }, 100)
      }
    }
    this.hide = () => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.setState({ visible: false })
      }, 200)
    }
  }
  
  pushTo(path: string) {
    const { menuClick } = this.props
    if (menuClick) {
      menuClick(path)
    }
    this.hide()
  }

  render() {
    const { visible } = this.state
    if (!visible) {
      return null
    }
    const { mode, fontColor, language } = this.props
    let maskClass
    let cellClass
    if (mode === ESystemTheme.day) {
      maskClass = 'user-ctrl-day'
      cellClass = 'cell cell-day'
    } else {
      maskClass = 'user-ctrl-night'
      cellClass = 'cell cell-night'
    }
    return (
      <div
        id="user-ctrl"
        className={maskClass}
        style={{ left: this.left }}
        onMouseEnter={() => this.show(this.left)}
        onMouseLeave={() => this.hide()}
      >
        <div className={cellClass}>
          <i className="iconfont icon-wode icon" />
          <span
            className="menu-text"
            style={{ color: getFontColor(fontColor)}}
          >{localWithKey(language, 'my-page')}</span>
        </div>
        <div className={cellClass}>
          <i className="iconfont icon-shuqian icon" />
          <span
            className="menu-text"
            style={{ color: getFontColor(fontColor)}}
          >{localWithKey(language, 'my-collect')}</span>
        </div>
        <div className={cellClass}>
          <i className="iconfont icon-xihuan icon" />
          <span
            className="menu-text"
            style={{ color: getFontColor(fontColor)}}
          >{localWithKey(language, 'my-like')}</span>
        </div>
        <div className={cellClass}>
          <i className="iconfont icon-guanzhu icon" />
          <span
            className="menu-text"
            style={{ color: getFontColor(fontColor)}}
          >{localWithKey(language, 'my-focus')}</span>
        </div>
        <div
          className={cellClass}
          onClick={() => this.pushTo('/s')}
        >
          <i className="iconfont icon-shezhi icon" />
          <span
            className="menu-text"
            style={{ color: getFontColor(fontColor)}}
          >{localWithKey(language, 'setting')}</span>
        </div>
        <div
          className={cellClass}
        >
          <i className="iconfont icon-neibufankui icon" />
          <span
            className="menu-text"
            style={{ color: getFontColor(fontColor)}}
          >{localWithKey(language, 'help-feed')}</span>
        </div>
        <div
          className={cellClass}
          onClick={() => this.pushTo(undefined)}
        >
          <i className="iconfont icon-ai-out icon" />
          <span
            className="menu-text"
            style={{ color: getFontColor(fontColor)}}
          >{localWithKey(language, 'log-out')}</span>
        </div>
      </div>
    )
  }
}
