import * as React from 'react'
import Modal from 'antd/lib/modal'
import { EFontFamily, ESystemTheme } from '../../reducer/main'
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
  type: EConfirmTypes
  title: string
  content: string
  cancel?: IConfirmButton
  ok?: IConfirmButton
}

interface IConfirmState extends IConfirmParams {
  visible: boolean
}

export interface IConfirmProps {
  mode?: ESystemTheme
  fontFamily?: EFontFamily
  ref: (e: Confirm) => void
}

export default class Confirm extends React.Component<IConfirmProps, IConfirmState> {
  constructor(props: IConfirmProps) {
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
        return <i className="iconfont icon-infoo icon info" />
      case EConfirmTypes.SUCCESS:
        return <i className="iconfont icon-miaojiesellersuccessbig icon succ" />
      case EConfirmTypes.ERROR:
        return <i className="iconfont icon-errorsign icon err" />
      case EConfirmTypes.WARNING:
        return <i className="iconfont icon-warning-circle icon warning" />
      case EConfirmTypes.DELETE:
        return <i className="iconfont icon-ask icon del" />
      default:
        return <i className="iconfont icon-ask icon ask" />
    }
  }

  private getConfig() {
    const { mode } = this.props
    let config
    if (mode === ESystemTheme.night) {
      config = {
        mask: 'base-model-night',
        color: '#C8C8C8'
      }
    } else {
      config = {
        mask: 'base-model-day',
        color: '#333333'
      }
    }
    return config
  }

  render() {
    const { visible, type, title, content, cancel, ok } = this.state
    if (!visible) {
      return null
    }
    const { fontFamily } = this.props
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
              <div
                className="confirm-title"
                style={{ color: config.color }}
              >
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
