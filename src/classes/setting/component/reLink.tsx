import * as React from 'react'
import Modal from 'antd/lib/modal'
import * as instance from '../../../utils/instance'
import { ELanguageEnv, ESystemTheme, EFontFamily } from '../../../reducer/main'
import localWithKey from '../../../language'
import { getFontFamily } from '../../../utils/font'
import { code_all } from '../../../utils/config'
import { isPhone, isEmail, isCode } from '../../../utils/utils'
import { showTips, EShowTipsType } from '../../../utils/tips';
import { sendCode, ESendCodeType, sendEmailCode, bindEmail, bindPhone, ILoginResponse } from '../../../http/user'

export enum ERelinkType {
  PHONE = 0,
  EMAIL,
}

export interface IRelinkProps {
  fontFamily?: EFontFamily
  language?: ELanguageEnv
  mode?: ESystemTheme
}

interface IRelinkState {
  visible: boolean
  type: ERelinkType
  handler?: (nextVal: string) => void
  account: string
  code: string
  limit: number
}

export default class Relink extends React.Component<IRelinkProps, IRelinkState> {
  private isRequest: boolean = false
  private timer: any

  constructor(props: IRelinkProps) {
    super(props)
    this.state = {
      visible: false,
      type: ERelinkType.PHONE,
      handler: undefined,
      account: '',
      code: '',
      limit: code_all
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
        limit: code_all,
      })
    }
  }

  private getConfig() {
    const { mode } = this.props
    let config
    if (mode === ESystemTheme.night) {
      config = {
        mask: 'base-model-night',
        color: '#C8C8C8',
        border: '1px solid #2F2F2F',
        background: '#4B4B4B',
      }
    } else {
      config = {
        mask: 'base-model-day',
        color: '#333333',
        border: '1px solid #DDDDDD',
        background: '#F7F7F7'
      }
    }
    return config
  }

  public show(type: ERelinkType, handler: (nextVal: string) => void) {
    this.setState({
      visible: true,
      type,
      handler: handler,
    })
  }

  private hide() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.setState({
      visible: false,
      type: ERelinkType.PHONE,
      handler: undefined,
      account: '',
      code: '',
      limit: code_all
    })
  }

  preSendCode() {
    if (this.isRequest) return
    const { limit, account, type } = this.state
    const { language } = this.props
    if (type === ERelinkType.EMAIL) {
      if (!isEmail(account)) {
        showTips(localWithKey(language, 'email-illegal'))
        return
      }
      if (limit === code_all) {
        this.isRequest = true
        sendEmailCode({
          language,
          terminal: account,
          type: ESendCodeType.OTHER
        }, (err) => {
          this.isRequest = false
          if (err) {
            showTips(err)
          } else {
            this.cutdown(code_all)
          }
        })
      }
    } else {
      if (!isPhone(account)) {
        showTips(localWithKey(language, 'number-illegal'))
        return
      }
      if (limit === code_all) {
        this.isRequest = true
        sendCode({
          language,
          terminal: account,
          type: ESendCodeType.CHANGEPHONE
        }, (err) => {
          this.isRequest = false
          if (err) {
            showTips(err)
          } else {
            this.cutdown(code_all)
          }
        })
      }
    }
  }

  updateInfo() {
    if (this.isRequest) return
    const { handler, account, code, type } = this.state
    const { language } = this.props
    if (!isCode(code)) {
      showTips(localWithKey(language, 'code-illegal'))
      return
    }
    const info = instance.getValueByKey('info') as ILoginResponse
    if (type === ERelinkType.PHONE) {
      if (!isPhone(account)) {
        showTips(localWithKey(language, 'phone-illegal'))
        return
      }
      this.isRequest = true
      bindPhone({
        id: info.id,
        token: info.token,
        phone: account,
        code: parseInt(code)
      }, (err) => {
        this.isRequest = false
        if (err) {
          showTips(err)
        } else {
          showTips(localWithKey(language, 'save-success'), EShowTipsType.success)
          handler && handler(account)
          this.hide()
        }
      })
    } else {
      if (!isEmail(account)) {
        showTips(localWithKey(language, 'email-illegal'))
        return
      }
      this.isRequest = true
      bindEmail({
        id: info.id,
        token: info.token,
        email: account,
        code: parseInt(code)
      }, (err) => {
        this.isRequest = false
        if (err) {
          showTips(err)
        } else {
          showTips(localWithKey(language, 'save-success'), EShowTipsType.success)
          handler && handler(account)
          this.hide()
        }
      })
    }
  }

  render() {
    const { visible, type, account, code, limit } = this.state
    if (!visible) {
      return null
    }
    const { fontFamily, language } = this.props
    const config = this.getConfig()
    return (
      <Modal
        zIndex={10}
        className={config.mask}
        style={{ top: 120 }}
        title={null}
        maskClosable={false}
        closable={false}
        visible
        width={420}
        footer={null}
      >
        <div
          style={{
            fontFamily: getFontFamily(fontFamily),
            paddingBottom: 30,
          }}
        >
          <div
            className="pic-edit-header"
            style={{ borderBottom: config.border }}
          >
            <span className="pic-edit-title" style={{ color: config.color }}>
              {localWithKey(language, type === ERelinkType.PHONE ? 'link-phone' : 'link-email')}
            </span>
            <i
              className="iconfont icon-guanbi pic-edit-close"
              onClick={() => this.hide()}
            />
          </div>
          <div
            className="pic-edit-body"
            style={{ border: config.border, background: config.background }}
          >
            <div
              className="pic-edit-cell"
              style={{ borderBottom: config.border }}
            >
              <i
                className={`iconfont ${type === ERelinkType.PHONE ? 'icon-shouji-tianchong' : 'icon-tubiao209'} pic-edit-icon`}
                style={{ color: config.color }}
              />
              <input
                value={account}
                maxLength={type === ERelinkType.PHONE ? 11 : 30}
                onChange={e => this.setState({ account: e.target.value })}
                className="pic-edit-input"
                placeholder={localWithKey(language, type === ERelinkType.PHONE ? 'input-phone' : 'input-email')}
                style={{ color: config.color }}
              />
            </div>
            <div className="pic-edit-cell">
              <i
                className="iconfont icon-iconfontanquan pic-edit-icon"
                style={{ color: config.color }}
              />
              <input
                value={code}
                onChange={e => this.setState({ code: e.target.value })}
                className="pic-edit-input"
                maxLength={6}
                placeholder={localWithKey(language, 'code')}
                style={{ color: config.color }}
              />
              <span
                className="send-code"
                onClick={() => this.preSendCode()}
              >
                {limit === code_all ? localWithKey(language, 'send-code') : `${limit} S`}
              </span>
            </div>
          </div>
          <div className="bind" onClick={() => this.updateInfo()}>
            {localWithKey(language, 'link')}
          </div>
        </div>
      </Modal>
    )
  }
}
