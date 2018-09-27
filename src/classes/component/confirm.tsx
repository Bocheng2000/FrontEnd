import * as React from 'react'
import Modal from 'antd/lib/modal'
import { ELanguageEnv, EFontFamily } from '../../reducer/main'
import { getFontFamily } from '../../utils/font'

export enum EConfirmTypes {
  CONFIRM = 0,
  INFO,
  SUCCESS,
  ERROR,
  WARNING,
  DELETE
}

export interface IConfirmButton {
  title: string
  handler?: () => void
}

export interface IConfirmParams {
  ref?: (e: Confirm) => void
  fontFamily?: EFontFamily
  type: EConfirmTypes
  title: string
  content: string
  cancel?: IConfirmButton
  ok?: IConfirmButton
}

interface IConfirmState extends IConfirmParams {
  visible: boolean
}

export default class Confirm extends React.Component<{}, IConfirmState> {
  constructor(props: object) {
    super(props)
    this.state = {
      visible: false,
      type: EConfirmTypes.CONFIRM,
      title: undefined,
      content: undefined,
      cancel: undefined,
      ok: undefined,
    }
  }

  public show(params: IConfirmParams) {
    this.setState({
      visible: true,
      ...params,
    })
  }

  private hide() {
    this.setState({
      visible: false,
      type: EConfirmTypes.CONFIRM,
      title: undefined,
      content: undefined,
      cancel: undefined,
      ok: undefined,
    })
  }

  private renderIcon(type: EConfirmTypes) {
    switch (type) {
      case EConfirmTypes.INFO:
        return <i className="iconfont icon-infoo icon" />
      case EConfirmTypes.SUCCESS:
        return <i className="iconfont icon-miaojiesellersuccessbig icon" />
      case EConfirmTypes.ERROR:
        return <i className="iconfont icon-errorsign icon" />
      case EConfirmTypes.WARNING:
        return <i className="iconfont icon-warning-circle icon" />
      case EConfirmTypes.DELETE:
        return <i className="iconfont icon-ask icon" />
      default:
        return <i className="iconfont icon-ask icon" />
    }
  }

  render() {
    const { visible, fontFamily, type, title, content, cancel, ok } = this.state
    if (!visible) {
      return null
    }
    return (
      <Modal
        style={{ top: 120 }}
        title={null}
        maskClosable={false}
        closable={false}
        visible
        footer={null}
      >
        <div id="confirm" style={{ fontFamily: getFontFamily(fontFamily) }}>
          <i
            className="iconfont icon-guanbi confirm-close"
            onClick={() => this.hide()}
          />
          <div className="confirm-body">
            {this.renderIcon(type)}
            <div className="confirm-text">
              <div className="confirm-title">
                {title}
              </div>
              <div className="confirm-content">
                {content}
              </div>
            </div>
          </div>
          <div className="confirm-footer">
            {
              cancel && cancel.title ?
                (
                  <span
                    className="btn button-o"
                    onClick={() => {
                      this.hide()
                      cancel.handler && cancel.handler()
                    }}
                  >
                    {cancel.title}
                  </span>
                ) : null
            }
            {
              ok && ok.title ?
                (
                  <span
                    className="btn button"
                    onClick={() => {
                      this.hide()
                      ok.handler && ok.handler()
                    }}
                  >
                    {ok.title}
                  </span>
                ) : null
            }
          </div>
        </div>
      </Modal>
    )
  }
}
