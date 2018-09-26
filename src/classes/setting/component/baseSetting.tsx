import * as React from 'react'
import Radio from 'antd/lib/radio'
import { connect } from 'react-redux'
import { ILoginResponse } from '../../../http/user'
import Loading from './loading'
import { IStoreState } from '../../../reducer'
import { ESystemTheme, ELanguageEnv, EFontColor, EFontFamily } from '../../../reducer/main'
import PicEditor from '../../component/picEditor'
import localWithKey from '../../../language'
import { getFontColor, getFontFamily } from '../../../utils/font';

const { Group } = Radio

interface IBaseSettingProps {
  mode: ESystemTheme
  language: ELanguageEnv
  fontColor: EFontColor
  fontFamily: EFontFamily
  info: ILoginResponse
}

interface IBaseSettingState {
  init: boolean
  info: ILoginResponse
}

class BaseSetting extends React.Component<IBaseSettingProps, IBaseSettingState> {
  private timer: any

  constructor(props: IBaseSettingProps) {
    super(props)
    this.state = {
      init: false,
      info: props.info
    }
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ init: true })
    }, 1000)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
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

  renderPhone(language: ELanguageEnv, config: any, color: string) {
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'mobile')}
        </span>
        <span
          className="value"
          style={{ color }}
        >18018037030</span>
        <i className="iconfont icon-duihao gou" />
        <span className="verificate">已验证</span>
        <span className={`unbind ${config.unbind}`}>解除绑定</span>
      </div>
    )
  }

  renderEmail(language: ELanguageEnv, config: any) {
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'email')}
        </span>
        <span className={`change ${config.changeClass}`}>
          {localWithKey(language, 'link-bind')}
        </span>
      </div>
    )
  }

  renderEditor(language: ELanguageEnv, config: any, color: string, family: string) {
    return (
      <div className={`base ${config.borderBottom}`}>
          <span className="name-tag">
            {localWithKey(language, 'editor')}
          </span>
          <Group
            onChange={e => console.log(e)}
            value={2}
          >
            <Radio value={1}>
              <span
                className="value"
                style={{ color, fontFamily: family }}
              >富文本</span>
            </Radio>
            <Radio value={2}>
              <span
                className="value"
                style={{ color, fontFamily: family }}
              >Macdown</span>
            </Radio>
          </Group>
        </div>
        
    )
  }

  renderLanguahe(language: ELanguageEnv, config: any, color: string, family: string) {
    return (
      <div className={`base ${config.borderBottom}`}>
          <span className="name-tag">
            {localWithKey(language, 'language-set')}
          </span>
          <Group
            onChange={e => console.log(e)}
            value={2}
          >
            <Radio value={1}>
              <span
                className="value"
                style={{ color, fontFamily: family }}
              >中文简体</span>
            </Radio>
            <Radio value={2}>
              <span
                className="value"
                style={{ color, fontFamily: family }}
              >中文繁體</span>
            </Radio>
            <Radio value={3}>
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
    return (
      <div className={`base ${config.borderBottom}`}>
          <span className="name-tag">
            {localWithKey(language, 'receive-notice')}
          </span>
          <Group
            onChange={e => console.log(e)}
            value={2}
          >
            <Radio value={1}>
              <span
                className="value"
                style={{ color, fontFamily: family }}
              >{localWithKey(language, 'receive-all')}</span>
            </Radio>
            <Radio value={2}>
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
    return (
      <div className={`base ${config.borderBottom}`}>
          <span className="name-tag">
            {localWithKey(language, 'emial-notice')}
          </span>
          <Group
            onChange={e => console.log(e)}
            value={2}
          >
            <Radio value={1}>
              <span
                className="value"
                style={{ color, fontFamily: family }}
              >{localWithKey(language, 'email-all')}</span>
            </Radio>
            <Radio value={2}>
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
        {this.renderEmail(language, config)}
        {this.renderEditor(language, config, color, family)}
        {this.renderLanguahe(language, config, color, family)}
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