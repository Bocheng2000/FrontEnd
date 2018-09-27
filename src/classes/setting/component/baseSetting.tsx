import * as React from 'react'
import Radio from 'antd/lib/radio'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { animate_delay } from '../../../utils/config'
import { ILoginResponse, ISettingResponse, findSetting, updateSetting, ESettingEditor } from '../../../http/user'
import Loading from './loading'
import { IStoreState } from '../../../reducer'
import { ESystemTheme, ELanguageEnv, EFontColor, EFontFamily } from '../../../reducer/main'
import localWithKey from '../../../language'
import { getFontColor, getFontFamily } from '../../../utils/font'
import * as instance from '../../../utils/instance'
import { showTips, EShowTipsType } from '../../../utils/tips'
import * as UserActions from '../../../action/user'

const { Group } = Radio

interface IBaseSettingProps {
  mode: ESystemTheme
  language: ELanguageEnv
  fontColor: EFontColor
  fontFamily: EFontFamily
  info: ILoginResponse
  dispatch?: Dispatch
}

interface IBaseSettingState {
  init: boolean
  info: ILoginResponse
  setting: ISettingResponse
}

class BaseSetting extends React.Component<IBaseSettingProps, IBaseSettingState> {
  private timer: any
  private userAction: typeof UserActions

  constructor(props: IBaseSettingProps) {
    super(props)
    this.userAction = bindActionCreators(UserActions, props.dispatch)
    this.state = {
      init: false,
      info: props.info,
      setting: undefined
    }
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.findSetting()
    }, animate_delay)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  findSetting() {
    const info = instance.getValueByKey('info') as ILoginResponse
    findSetting({ id: info.id, token: info.token }, (err, data) => {
      if (err) {
        showTips(err)
      } else {
        this.setState({ setting: data, init: true })
      }
    })
  }

  getConfig() {
    const { mode } = this.props
    const isDay = mode === ESystemTheme.day
    const res = {
      changeClass: 'change-day',
      nameInput: 'name-input-day',
      borderBottom: 'base-day',
      unbind: 'unbind-day'
    }
    if (!isDay) {
      res.changeClass = 'change-night'
      res.nameInput = 'name-input-night'
      res.borderBottom = 'base-night'
      res.unbind = 'unbind-night'
    }
    return res
  }

  updateSetting(params: any) {
    const info = instance.getValueByKey('info') as ILoginResponse
    updateSetting({ id: info.id, token: info.token, ...params, },
      (err) => {
        if (err) {
          showTips(err)
        } else {
          const { language } = this.props
          showTips(localWithKey(language, 'save-success'), EShowTipsType.success)
          this.configState(params)
        }
    })
  }

  configState(params: any) {
    const { setting } = this.state
    this.setState({ setting:  { ...setting, ...params }})
  }

  renderPhone(language: ELanguageEnv, config: any, color: string) {
    const { setting } = this.state
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'mobile')}
        </span>
        {
          setting.bindPhone ?
            (
              <div>
                <span
                  className="value"
                  style={{ color }}
                >{setting.bindPhone}</span>
                <i className="iconfont icon-duihao gou" />
                <span className="verificate">
                  {localWithKey(language, 'verified')}
                </span>
                <span className={`unbind ${config.unbind}`}>
                  {localWithKey(language, 'un-bind')}
                </span>
              </div>
            ) :
            (
              <span className={`change ${config.changeClass}`}>
                {localWithKey(language, 'link-phone')}
              </span>
            )
        }
      </div>
    )
  }

  renderEmail(language: ELanguageEnv, config: any, color: string) {
    const { setting } = this.state
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'email')}
        </span>
        {
          setting.bindEmail ?
            (
              <div>
                <span
                  className="value"
                  style={{ color }}
                >{setting.bindEmail}</span>
                <i className="iconfont icon-duihao gou" />
                <span className="verificate">
                  {localWithKey(language, 'verified')}
                </span>
                <span className={`unbind ${config.unbind}`}>
                  {localWithKey(language, 'un-bind')}
                </span>
              </div>
            ) : (
              <span className={`change ${config.changeClass}`}>
                {localWithKey(language, 'link-email')}
              </span>
            )
        }
      </div>
    )
  }

  renderEditor(language: ELanguageEnv, config: any, color: string, family: string) {
    const { setting } = this.state
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'editor')}
        </span>
        <Group
          onChange={(e) => this.updateSetting({ editor: e.target.value })}
          value={setting.editor}
        >
          <Radio value={0}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'rich-text')}</span>
          </Radio>
          <Radio value={1}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'mac-down')}</span>
          </Radio>
        </Group>
      </div>
    )
  }

  renderTheme(language: ELanguageEnv, config: any, color: string, family: string) {
    const { setting } = this.state
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'theme-model')}
        </span>
        <Group
          onChange={e => this.updateSetting({ theme: e.target.value })}
          value={setting.theme}
        >
          <Radio value={0}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'off')}</span>
          </Radio>
          <Radio value={1}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'on')}</span>
          </Radio>
        </Group>
      </div>
    )
  }

  renderLanguage(language: ELanguageEnv, config: any, color: string, family: string) {
    const { setting } = this.state
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'language-set')}
        </span>
        <Group
          onChange={e => this.updateSetting({ language: e.target.value })}
          value={setting.language}
        >
          <Radio value={0}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >中文简体</span>
          </Radio>
          <Radio value={1}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >中文繁體</span>
          </Radio>
          <Radio value={2}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >English</span>
          </Radio>
        </Group>
      </div>
    )
  }

  renderReceiveNotice(language: ELanguageEnv, config: any, color: string, family: string) {
    const { setting } = this.state
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'receive-notice')}
        </span>
        <Group
          onChange={e => this.updateSetting({ receiveNotice: e.target.value })}
          value={setting.receiveNotice}
        >
          <Radio value={0}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'receive-all')}</span>
          </Radio>
          <Radio value={1}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'receive-follow')}</span>
          </Radio>
        </Group>
      </div>

    )
  }

  renderEmailNotice(language: ELanguageEnv, config: any, color: string, family: string) {
    const { setting } = this.state
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'emial-notice')}
        </span>
        <Group
          onChange={e => this.updateSetting({ emailNotice: e.target.value })}
          value={setting.emailNotice}
        >
          <Radio value={0}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'email-all')}</span>
          </Radio>
          <Radio value={1}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'email-refuse')}</span>
          </Radio>
        </Group>
      </div>
    )
  }

  render() {
    const { init } = this.state
    const { mode, language, fontColor, fontFamily } = this.props
    if (!init) {
      return <Loading mode={mode} />
    }
    const config = this.getConfig()
    const color = getFontColor(fontColor)
    const family = getFontFamily(fontFamily)
    return (
      <div
        className="base-setting"
        style={{ fontFamily: family }}
      >
        {this.renderPhone(language, config, color)}
        {this.renderEmail(language, config, color)}
        {this.renderEditor(language, config, color, family)}
        {this.renderTheme(language, config, color, family)}
        {this.renderLanguage(language, config, color, family)}
        {this.renderReceiveNotice(language, config, color, family)}
        {this.renderEmailNotice(language, config, color, family)}
      </div>
    )
  }
}

function mapStateToProps({
  main: { system: { fontFamily, fontColor, language, mode } },
  user: { info }
}: IStoreState) {
  return {
    mode,
    language,
    fontColor,
    fontFamily,
    info
  }
}

export default connect(mapStateToProps)(BaseSetting)