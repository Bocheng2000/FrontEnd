import * as React from 'react'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
import { getFontFamily } from '../../utils/font'
import { ESystemTheme, EFontFamily, ELanguageEnv } from '../../reducer/main'
import localWithKey from '../../language'
import { report, EReportType } from '../../http/report'
import * as instance from '../../utils/instance'
import { ILoginResponse } from '../../http/user'
import { showTips, EShowTipsType } from '../../utils/tips'

const { Group } = Radio

export interface IReportProps {
  mode?: ESystemTheme
  fontFamily?: EFontFamily
  language?: ELanguageEnv
  ref?: (e: Report) => void
}

export interface IReportOptions {
  title: string
  id: number
}

export interface IReportParams {
  type: EReportType
  objectId: string
  title: string
  defaultOptions?: Array<IReportOptions>
  handler?: (ok: boolean) => void
}

export interface IReportState extends IReportParams {
  visible: boolean
  id: number
  value: string
}

export default class Report extends React.Component<IReportProps, IReportState> {
  private isRequest: boolean
  constructor(props: IReportProps) {
    super(props)
    this.state = {
      type: EReportType.POST,
      objectId: '',
      title: '',
      handler: undefined,
      visible: false,
      defaultOptions: undefined,
      id: 0,
      value: '',
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
        areaClass: 'name-input-night'
      }
    } else {
      config = {
        mask: 'base-model-day',
        color: '#333333',
        border: '1px solid #DDDDDD',
        areaClass: 'name-input-day'
      }
    }
    return config
  }

  show(params: IReportParams) {
    const { language } = this.props
    const opts = params.defaultOptions
    if (opts) {
      opts.push({
        id: opts.length,
        title: localWithKey(language, 'optional')
      })
    }
    this.setState({
      visible: true,
      type: params.type,
      title: params.title,
      handler: params.handler,
      defaultOptions: opts,
      objectId: params.objectId
    })
  }

  private hide() {
    this.setState({
      visible: false,
      type: EReportType.POST,
      title: '',
      handler: undefined,
      defaultOptions: undefined,
      id: 0,
      value: '',
    })
  }

  report() {
    if (this.isRequest) return
    this.isRequest = true
    const { id, value, defaultOptions, objectId, type, handler } = this.state
    const info = instance.getValueByKey('info') as ILoginResponse
    let reason, opt
    if (!defaultOptions) {
      reason = ''
    } else if (id === defaultOptions.length - 1) {
      reason = ''
    } else {
      reason = defaultOptions[id].title
    }
    reason = reason.trim()
    opt = value.trim()
    if (reason.length === 0 && opt.length === 0) {
      const { language } = this.props
      showTips(localWithKey(language, 'invalid-reason'))
      this.isRequest = false
      return
    }
    report({
      id: info.id, token: info.token,
      objectId, reason, opt, type
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
      } else {
        const { language } = this.props
        showTips(localWithKey(language, 'reaport-success'), EShowTipsType.success)
        handler && handler(!err)
        this.hide()
      }
    })
  }

  renderRadioGroup(config: any) {
    const { id, defaultOptions } = this.state
    if (!defaultOptions) return null
    const color = config.color
    const { fontFamily, language } = this.props
    const family = getFontFamily(fontFamily)
    return (
      <Group
        onChange={(e) => this.setState({ id: e.target.value })}
        value={id}
      >
        {
          defaultOptions.map(e => (
            <Radio value={e.id} key={e.id}>
              <span
                className="value"
                style={{ color, fontFamily: family }}
              >{e.title}</span>
            </Radio>
          ))
        }
      </Group>
    )
  }

  render() {
    const { visible, title, value, id, defaultOptions } = this.state
    if (!visible) return null
    const config = this.getConfig()
    const { fontFamily, language } = this.props
    let placeholder
    if (!defaultOptions) {
      placeholder = 'input-report-value'
    } else if (defaultOptions.length === id + 1) {
      placeholder = 'input-report-value'
    } else {
      placeholder = 'input-report-value-opt'
    }
    return (
      <Modal
        zIndex={10}
        centered
        className={config.mask}
        title={null}
        maskClosable={false}
        closable={false}
        visible
        footer={null}
        width={400}
      >
        <div style={{ fontFamily: getFontFamily(fontFamily) }}>
          <div className="pic-edit-header">
            <span className="pic-edit-title" style={{ color: config.color }}>
              {title}
            </span>
            <i
              className="iconfont icon-guanbi pic-edit-close"
              onClick={() => this.hide()}
            />
          </div>
          <div className="pic-edit-body" style={{ marginTop: 10 }}>
            {this.renderRadioGroup(config)}
            <textarea
              value={value}
              maxLength={200}
              placeholder={localWithKey(language, placeholder)}
              onChange={e => this.setState({ value: e.target.value })}
              className={`pic-edit-editor ${config.areaClass}`}
              style={{ width: '100%' }}
            />
          </div>
          <div className="pic-edit-tool">
            <div className="cell" style={{ justifyContent: 'flex-end' }}>
              <span
                className="done"
                onClick={() => this.report()}
              >
                {localWithKey(language, 'done')}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
