import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import SignHeader from '../component/signHeader'
import { IStoreState } from '../../reducer'
import { EFontFamily, EFontColor, ELanguageEnv, ESystemTheme} from '../../reducer/main'
import localWithKey from '../../language'
import { getFontFamily } from '../../utils/font'
import { login } from '../../http/user'
import { showTips, EShowTipsType } from '../../utils/tips'
import * as instance from '../../utils/instance'
import * as UserActions from '../../action/user'

interface ILoginProps {
  fontFamily: EFontFamily;
  fontColor: EFontColor;
  language: ELanguageEnv;
  mode: ESystemTheme;
  dispatch?: Dispatch;
}

interface ILoginState {
  phone: string;
  password: string;
  remeber: boolean;
}

class Login extends React.Component<ILoginProps, ILoginState> {
  private isLogin: boolean = false
  private userAction: typeof UserActions
  
  constructor(props: ILoginProps) {
    super(props)
    this.userAction = bindActionCreators(UserActions, props.dispatch)
    const remeber = !!localStorage.getItem('remeber')
    let phone = ''
    let password = ''
    if (remeber) {
      phone = localStorage.getItem('phone')
      password = localStorage.getItem('password')
    }
    this.state = {
      phone,
      password,
      remeber,
    }
  }

  componentWillMount() {
    const user = localStorage.getItem('user')
    if (user) {
      const json = JSON.parse(user)
      this.userAction.updateKeyValue('info', json)
      instance.setValueByKey('info', json)
      instance.getValueByKey('history').replace('/')
    }
  }

  componentWillUnmount() {

  }

  loginDidClick() {
    const { phone, password, remeber } = this.state
    if (!phone.length || !password.length || this.isLogin)
      return
    this.isLogin = true
    login({ phone: phone, password: password }, (err, r) => {
      this.isLogin = false
      if (err) {
        showTips(err)
      } else {
        if (remeber) {
          localStorage.setItem('phone', phone)
          localStorage.setItem('password', password)
          localStorage.setItem('remeber', remeber ? 'true' : '')
        } else {
          localStorage.removeItem('phone')
          localStorage.removeItem('password')
          localStorage.removeItem('remeber')
        }
        const { language } = this.props
        showTips(localWithKey(language, 'login-success'), EShowTipsType.success)
        this.userAction.updateKeyValue('info', r)
        localStorage.setItem('user', JSON.stringify(r))
        instance.getValueByKey('history').replace('/')
      }
    })
  }

  render() {
    const { fontFamily, language, mode } = this.props
    const { phone, password, remeber } = this.state
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
          <SignHeader language={language} index={0} />
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
                value={phone}
                className="base account"
                onChange={e => this.setState({ phone: e.target.value })}
                style={{ color: dict.textColor }}
                placeholder={localWithKey(language, 'mobile-email')}
              />
            </div>
            <div
              className="cell"
            >
              <i className="iconfont icon-password acc" />
              <input
                value={password}
                className="base password"
                onChange={e => this.setState({ password: e.target.value })}
                style={{ color: dict.textColor }}
                type="password"
                placeholder={localWithKey(language, 'password')}
              />
            </div>
          </div>
          <div className="tools">
            <div className="remember">
              <input
                type="checkbox"
                className="check"
                checked={remeber}
                onChange={e => this.setState({ remeber: e.target.checked })}
              />
              <span>{localWithKey(language, 'remember')}</span>
            </div>
            <div className={mode == ESystemTheme.day ? 'day' : 'night'}>
              {localWithKey(language, 'trouble')}
            </div>
          </div>
          <div
            className="login-btn"
            onClick={() => this.loginDidClick()}
          >
            {localWithKey(language, 'login')}
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

export default connect(mapStateToProps)(Login)