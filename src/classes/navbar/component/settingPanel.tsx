import * as React from 'React'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import * as $ from 'jquery'
import * as MainActions from '../../../action/main'
import SwitchBtn from '../../component/SwitchBtn'
import { EFontColor, ESystemTheme, ELanguageEnv, EFontFamily } from '../../../reducer/main'
import { ISwitchData } from '../../component/switchBtn'
import { getThemeColor, getFontFamily } from '../../../utils/font'
import localWithKey from '../../../language';
import * as instance from '../../../utils/instance'

export interface ISettingPanelProps {
  ref?: (e: SettingPanel) => void;
  mode: ESystemTheme;
  fontFamily: EFontFamily;
  language: ELanguageEnv;
  fontColor: EFontColor;
  dispatch?: Dispatch;
}

export interface ISettingPanelState {
  visible: boolean
}

class SettingPanel extends React.Component<ISettingPanelProps, ISettingPanelState> {
  private mainAction: typeof MainActions
  private timer: any
  private left: number
  public show: (left: number) => void
  public hide: () => void
  constructor(props: ISettingPanelProps) {
    super(props)
    this.mainAction = bindActionCreators(MainActions, props.dispatch)
    this.show = (left: number) => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      const { visible } = this.state
      this.left = left
      if (!visible) {
        this.setState({ visible: true })
        setTimeout(() => {
          $('#setting-panel').css('opacity', "1")
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
    this.state = {
      visible: false,
    }
  }

  generateTheme(): Array<ISwitchData> {
    const { mode, language } = this.props
    return [
      {
        title: localWithKey(language, 'on'),
        high: mode === ESystemTheme.night,
        handler: () => {
          const target: HTMLElement = document.getElementsByTagName('body')[0]
          target.style.background = getThemeColor(ESystemTheme.night)
          this.mainAction.updateSystemConfig({
            'mode': ESystemTheme.night,
            'fontColor': EFontColor.night,
          })
          localStorage.setItem('mode', '1')
          localStorage.setItem('fontColor', '1')
          this.hide()
        },
      },
      {
        title: localWithKey(language, 'off'),
        high: mode === ESystemTheme.day,
        handler: () => {
          const target: HTMLElement = document.getElementsByTagName('body')[0]
          target.style.background = getThemeColor(ESystemTheme.day)
          this.mainAction.updateSystemConfig({
            'mode': ESystemTheme.day,
            'fontColor': EFontColor.day,
          })
          localStorage.setItem('mode', '')
          localStorage.setItem('fontColor', '')
          this.hide()
        },
      }
    ]
  }

  generateIFontFamily(): Array<ISwitchData> {
    const { fontFamily, language } = this.props
    return [
      {
        title: localWithKey(language, 'song'),
        high: fontFamily === EFontFamily.songti,
        style: {
          IFontFamily: getFontFamily(EFontFamily.songti),
        },
        handler: () => {
          this.mainAction.updateSystemConfig({
            'fontFamily': EFontFamily.songti,
          })
          localStorage.setItem('fontFamily', '1')
          this.hide()
        }
      },
      {
        title: localWithKey(language, 'yahei'),
        high: fontFamily === EFontFamily.yahei,
        style: {
          IFontFamily: getFontFamily(EFontFamily.yahei),
        },
        handler: () => {
          this.mainAction.updateSystemConfig({
            'fontFamily': EFontFamily.yahei,
          })
          localStorage.setItem('fontFamily', '')
          this.hide()
        }
      }
    ]
  }

  generateLanguage(): Array<ISwitchData> {
    const { language } = this.props
    return [
      {
        title: '简',
        high: language === ELanguageEnv.zhHans,
        handler: () => {
          this.mainAction.updateSystemConfig({
            'language': ELanguageEnv.zhHans,
          })
          localStorage.setItem('language', '')
          instance.setValueByKey('language', ELanguageEnv.zhHans)
          this.hide()
        }
      },
      {
        title: '繁',
        high: language === ELanguageEnv.zhHant,
        handler: () => {
          this.mainAction.updateSystemConfig({
            'language': ELanguageEnv.zhHant,
          })
          localStorage.setItem('language', '1')
          instance.setValueByKey('language', ELanguageEnv.zhHant)
          this.hide()
        }
      },
      {
        title: 'English',
        high: language === ELanguageEnv.en,
        handler: () => {
          this.mainAction.updateSystemConfig({
            'language': ELanguageEnv.en,
          })
          localStorage.setItem('language', '2')
          instance.setValueByKey('language', ELanguageEnv.en)
          this.hide()
        }
      }
    ]
  }

  render() {
    const { visible } = this.state
    if (!visible) {
      return null
    }
    const { mode, language } = this.props
    return (
      <div
        id="setting-panel"
        className={mode === ESystemTheme.day ? 'setting-day' : 'setting-night'}
        style={{ left: this.left }}
        onMouseEnter={() => this.show(this.left)}
        onMouseLeave={() => this.hide()}
      >
        <div
          className="menu"
          style={{ borderBottomColor : mode === ESystemTheme.day ? '#f0f0f0' : '#2f2f2f' }}
        >
          <i
            className="iconfont icon-yejianmoshi moon"
            style={{ color: mode === ESystemTheme.day ? '#969696' : '#C5C32F' }}
          />
          <span
            className="mode-text"
            style={{ color : mode === ESystemTheme.day ? '#969696' : '#C8C8C8'}}
          >{localWithKey(language, 'theme-model')}</span>
          <SwitchBtn data={this.generateTheme()} />
        </div>
        <div className="base">
          <SwitchBtn data={this.generateIFontFamily()} />
        </div>
        <div className="base">
          <SwitchBtn data={this.generateLanguage()} />
        </div>
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps, undefined, undefined, { withRef: true })(SettingPanel)