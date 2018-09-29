import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Link } from 'react-router-dom'
import SignHeader from '../component/signHeader'
import { IStoreState } from '../../reducer'
import { EFontFamily, EFontColor, ELanguageEnv, ESystemTheme} from '../../reducer/main'
import localWithKey from '../../language'
import { getFontFamily } from '../../utils/font'
import { isPhone, isCode } from '../../utils/utils'
import { showTips, EShowTipsType } from '../../utils/tips'
import { sendCode, ESendCodeType, create } from '../../http/user'
import * as UserActions from '../../action/user'
import * as instance from '../../utils/instance'
import { code_all } from '../../utils/config'

interface IRegistProps {
  fontFamily: EFontFamily;
  fontColor: EFontColor;
  language: ELanguageEnv;
  mode: ESystemTheme;
  dispatch?: Dispatch;
}

interface IRegistState {
  name: string
  phone: string
  code: string
  password: string
  limit: number
}

class Regist extends React.Component<IRegistProps, IRegistState> {
  private allLimit: number = code_all
  private isRequest: boolean = false
  private userAction: typeof UserActions
  private timer: any

  constructor(props: IRegistProps) {
    super(props)
    this.userAction = bindActionCreators(UserActions, props.dispatch)
    this.state = {
      name: '',
      phone: '',
      code: '',
      password: '',
      limit: this.allLimit,
    }
  }
  
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  cutdown(next: number) {
    if (next > 0) {
      this.setState({
        limit: next - 1,
      })
      this.timer = setTimeout(() => {
        this.cutdown(next - 1)
      }, 1000)
    } else {
      this.setState({
        limit: this.allLimit,
      })
    }
  }

  getConfig(mode: ESystemTheme) {
    const dict = {
      divBg: '#F1F1F1',
      maskBg: '#FFFFFF',
      inputBg: '#F7F7F7',
      border: '#C8C8C8',
      textColor: '#333333',
    }
    if (mode === ESystemTheme.night) {
      dict.divBg = '#333333'
      dict.maskBg = '#3F3F3F'
      dict.inputBg = '#4B4B4B'
      dict.border = '#2F2F2F'
      dict.textColor = '#FFFFFF'
    }
    return dict
  }

  sendCode() {
    if (this.isRequest) return
    const { limit, phone } = this.state
    const { language } = this.props
    if (!isPhone(phone)) {
      showTips(localWithKey(language, 'number-illegal'))
      return
    }
    if (limit === this.allLimit) {
      this.isRequest = true
      sendCode({ language, terminal: phone, type: ESendCodeType.REGIST },
        (err) => {
          this.isRequest = false
          if (err) {
            showTips(err)
          } else {
            this.cutdown(limit)
          }
      })
    }
  }

  registDidClick() {
    const { phone, name, code, password } = this.state
    const { language } = this.props
    if (!name.trim().length) {
      return showTips(localWithKey(language, 'input-name'))
    }
    if (!isPhone(phone)) {
      return showTips(localWithKey(language, 'number-illegal'))
    }
    if (!isCode(code)) {
      return showTips(localWithKey(language, 'code-illegal'))
    }
    if (!password.trim().length) {
      return showTips(localWithKey(language, 'input-password'))
    }
    return this.toRegist()
  }

  toRegist() {
    const { phone, name, code, password } = this.state
    if (this.isRequest) return
    this.isRequest = true
    create({ name, password, code: parseInt(code), phone }, (err, r) => {
      this.isRequest = false
      if (err) {
        return showTips(err, EShowTipsType.failed)
      } else {
        const { language } = this.props
        showTips(localWithKey(language, 'register-success'), EShowTipsType.success)
        this.userAction.updateKeyValue('info', r)
        instance.setValueByKey('info', r)
        localStorage.setItem('user', JSON.stringify(r))
        instance.getValueByKey('history').replace('/')
      }
    })
  }

  render() {
    const { fontFamily, language, mode } = this.props
    const { name, phone, code, password, limit } = this.state
    const dict = this.getConfig(mode)
    return (
      <div
        id="login"
        style={{
          fontFamily: getFontFamily(fontFamily),
          background: dict.divBg,
        }}
      >
        <i className="iconfont icon-yun logo" />
        <div
          className="mask"
          style={{ background: dict.maskBg }}
        >
          <SignHeader language={language} index={1} />
          <div
            className="text-area"
            style={{
              background: dict.inputBg,
              borderColor: dict.border,
            }}
          >
            <div
              className="cell"
              style={{ borderBottom: `1px solid ${dict.border}` }}
            >
              <i className="iconfont icon-iconzh1 acc" />
              <input
                className="base account"
                value={name}
                maxLength={10}
                style={{ color: dict.textColor }}
                placeholder={localWithKey(language, 'name')}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </div>
            <div
              className="cell"
              style={{ borderBottom: `1px solid ${dict.border}` }}
            >
              <i className="iconfont icon-shouji-tianchong acc" />
              <input
                className="base account"
                value={phone}
                style={{ color: dict.textColor }}
                maxLength={11}
                placeholder={localWithKey(language, 'mobile')}
                onChange={e => this.setState({ phone: e.target.value })}
              />
            </div>
            <div
              className="cell"
              style={{ borderBottom: `1px solid ${dict.border}` }}
            >
              <i className="iconfont icon-iconfontanquan acc" />
              <input
                className="base account"
                value={code}
                style={{ color: dict.textColor }}
                maxLength={6}
                placeholder={localWithKey(language, 'code')}
                onChange={e => this.setState({ code: e.target.value })}
              />
              <div
                className={
                  (limit === this.allLimit && phone.length === 11)
                    ? 'send-code-able' :
                    'send-code'}
                onClick={() => this.sendCode()}
              >
                {limit === this.allLimit ? localWithKey(language, 'send-code') : `${limit} S`}
              </div>
            </div>
            <div className="cell">
              <i className="iconfont icon-password acc" />
              <input
                className="base password"
                value={password}
                style={{ color: dict.textColor }}
                type="password"
                placeholder={localWithKey(language, 'password')}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </div>
          </div>
          <div
            className="regist-btn"
            onClick={() => this.registDidClick()}
          >
            {localWithKey(language, 'register')}
          </div>
          <div className="agree">
            {localWithKey(language, 'tip')}
            <br/>
            <Link className="link" to="/">
              {localWithKey(language, 'protocol')}
            </Link>
            <span>
              {localWithKey(language, 'and')}
            </span>
            <Link className="link" to="/">
              {localWithKey(language, 'policy')}
            </Link>
          </div>
        </div>
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

export default connect(mapStateToProps)(Regist)