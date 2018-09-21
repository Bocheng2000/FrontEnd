import * as React from 'React'
import { connect } from 'react-redux'
import { History } from 'history'
import { IStoreState } from '../../reducer'
import { EFontFamily, EFontColor, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import { getFontFamily, getFontColor } from '../../utils/font'
import localWithKey from '../../language'
import SettingPanel from './component/settingPanel'
import UserController from './component/userController'

export interface INavbarProps {
  fontFamily: EFontFamily;
  fontColor: EFontColor;
  language: ELanguageEnv;
  mode: ESystemTheme;
  history: History;
}

interface INavbarState {
  index: number;
}

class Navbar extends React.Component<INavbarProps, INavbarState> {
  private settingPanel: any
  private loginPanel: any
  constructor(props: INavbarProps) {
    super(props)
    this.state = {
      index: 0
    }
  }

  componentDidMount() {
    const path = window.location.pathname
    if (path.search('/p') === 0) {
      this.setHighIndex(0)
      return
    }
    if (path.search('/t') === 0) {
      this.setHighIndex(1)
      return
    }
    this.setHighIndex(0)
  }

  linkTo(path: string, idx: number) {
    this.props.history.push(path)
    this.setHighIndex(idx)
  }

  loginEnter(e: React.MouseEvent) {
    let target = e.target as HTMLElement
    const wrap = this.loginPanel
    if (wrap && wrap.show) {
      wrap.show(target.offsetLeft)
    }
  }

  loginLeave() {
    const wrap = this.loginPanel
    if (wrap && wrap.hide) {
      wrap.hide()
    }
  }

  settingEnter(e: React.MouseEvent) {
    let target = e.target as HTMLElement
    const wrap = this.settingPanel.wrappedInstance
    if (wrap && wrap.show) {
      wrap.show(target.offsetLeft - 108)
    }
  }

  settingLeave() {
    const wrap = this.settingPanel.wrappedInstance
    if (wrap && wrap.hide) {
      wrap.hide()
    }
  }

  setHighIndex(idx: number) {
    const { index } = this.state
    if (index !== idx) {
      this.setState({ index: idx })
    }
  }

  renderSearchBar(): JSX.Element {
    const { fontFamily, language, mode } = this.props
    return (
      <div
        className="search-bar"
        style={{ background: mode === ESystemTheme.day ? '#EEEEEE' : '#4F4F4F' }}
      >
        <input
          className="input"
          placeholder={localWithKey(language, 'search')}
          style={{
            fontFamily: getFontFamily(fontFamily),
            color: mode === ESystemTheme.day ? '#333333' : '#FFFFFF',
          }}
        />
        <i
          className="iconfont icon-search searchBtn"
          style={mode === ESystemTheme.night ? { color: '#FFFFFF' } : null}
        />
      </div>
    )
  }

  renderUnLogin() {
    const { language } = this.props
    return (
      <div>
        <span className="login" >
          {localWithKey(language, 'login')}
        </span>
        <span className="regist" >
          {localWithKey(language, 'regist')}
        </span>
      </div>
    )
  }

  renderLogined() {
    const { mode } = this.props
    return (
      <div
        className={`user-mask ${mode === ESystemTheme.day ? 'button-day' : 'button-night'}`}
        onMouseEnter={(e) => this.loginEnter(e)}
        onMouseLeave={() => this.loginLeave()}
      >
        <img className="avatar" src="https://pic1.zhimg.com/v2-f61af1c9cebe97e8743d32114ab890fd.jpg"/>
      </div>
    )
  }

  renderMenus(): JSX.Element {
    const { language } = this.props
    return (
      <div className="menus">
        <i
          className="iconfont icon-setting setting"
          onMouseEnter={(e) => this.settingEnter(e)}
          onMouseLeave={() => this.settingLeave()}
        />
        {this.renderLogined()}
        <span className="write" >
          <i className="iconfont icon-bi bi" />
          {localWithKey(language, 'write')}
        </span>
      </div>
    )
  }

  render() {
    const { fontFamily, language, fontColor, mode } = this.props
    const { index } = this.state
    return (
      <div
        id="navbar"
        style={{ fontFamily: getFontFamily(fontFamily) }}
      >
        <div className="bar">
          <i className="iconfont icon-yun logo" />
          <span
            onClick={() => this.linkTo('/', 0)}
            className={index === 0 ? "buttonHigh" : mode === ESystemTheme.day ? "button button-day" : " button button-night"}
            style={{ color: index === 0 ? '#ea6f5a' : getFontColor(fontColor) }}
          >
            {localWithKey(language, 'home')}
          </span>
          <span
            onClick={() => this.linkTo('/t', 1)}
            className={index === 1 ? "buttonHigh" : mode === ESystemTheme.day ? "button button-day" : " button button-night"}
            style={{ color: index === 1 ? '#ea6f5a' : getFontColor(fontColor) }}
          >
            {localWithKey(language, 'topic')}
          </span>
          {this.renderSearchBar()}
          {this.renderMenus()}
          <SettingPanel
            ref={(e) => { this.settingPanel = e }}
            fontFamily={fontFamily}
            fontColor={fontColor}
            language={language}
            mode={mode}
          />
          <UserController
            ref={(e) => { this.loginPanel = e }}
            fontFamily={fontFamily}
            fontColor={fontColor}
            language={language}
            mode={mode}
          />
        </div>
        <div className="holder" />
      </div>
    )
  }
}

function mapStateToProps({ main: { system: { fontFamily, fontColor, language, mode } } }: IStoreState) {
  return {
    fontFamily,
    fontColor,
    language,
    mode,
  }
}

export default connect(mapStateToProps)(Navbar)
