import * as React from 'react'
import * as $ from 'jquery'
import Modal from 'antd/lib/modal'
import { ESystemTheme, EFontFamily, ELanguageEnv } from '../../../reducer/main'
import { getFontFamily } from '../../../utils/font'
import localWithKey from '../../../language'
import { findByKey, IFindByKeyResponse } from '../../../http/special'
import { getHashUrl } from '../../../utils/http'
import { showTips } from '../../../utils/tips'

export interface ISelectSpecialProps {
  ref?: (e: SelectSpecial) => void
  fontFamily?: EFontFamily
  mode?: ESystemTheme
  language?: ELanguageEnv
}

export interface ISelectSpecialParams {
  handler?: (e?: IFindByKeyResponse) => void
}

interface ISelectSpecialState {
  visible: boolean
  handler?: (id?: IFindByKeyResponse) => void
  dataSource: Array<IFindByKeyResponse>
  selected: IFindByKeyResponse
}

export default class SelectSpecial extends React.Component<ISelectSpecialProps, ISelectSpecialState> {
  private timer: any
  constructor(props: ISelectSpecialProps) {
    super(props)
    this.state = {
      visible: false,
      handler: undefined,
      dataSource: [],
      selected: undefined
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
        bj: '#3F3F3F',
        li: 'special-item-night',
      }
    } else {
      config = {
        mask: 'base-model-day',
        color: '#333333',
        border: '1px solid #DDDDDD',
        bj: '#FFFFFF',
        li: 'special-item-day',
      }
    }
    return config
  }

  public show(params: ISelectSpecialParams) {
    this.setState({
      visible: true,
      handler: params.handler,
      dataSource: [],
      selected: undefined
    })
  }

  doneClick() {
    const { selected, handler } = this.state
    if (!selected) {
      const { language } = this.props
      showTips(localWithKey(language, 'select-special'))
      return
    }
    handler && handler(selected)
    this.hide()
  }

  hide() {
    this.setState({
      visible: false,
      handler: undefined,
      dataSource: [],
      selected: undefined
    })
    this.timer && clearTimeout(this.timer)
  }

  getSpecialByKey(key: string) {
    if (key.trim().length === 0) {
      this.setState({ dataSource: [], selected: undefined })
      return
    }
    this.timer = setTimeout(() => {
      findByKey({ key }, (err, data) => {
        if (err || !data) {
          this.setState({ dataSource: [], selected: undefined })
        } else {
          this.setState({ dataSource: data, selected: undefined })
        }
      })
    }, 200)
  }

  renderList(config: any) {
    const { dataSource } = this.state
    if (dataSource.length === 0) {
      return null
    }
    const { mode } = this.props
    return (
      <ul
        className={`special-contaier ${mode === ESystemTheme.night ? 'content-night' : 'content-day'}`}
        style={{ background: config.bj, border: config.border }}
      >
        {
          dataSource.map(e => (
            <li
              className={`special-item ${config.li}`}
              key={e.id}
              onClick={() => {
                this.setState({
                  selected: e,
                  dataSource: []
                })
                $('#input').val(e.title)
              }}
            >
              <img className="special-avatar" src={getHashUrl(e.avatar)} />
              <span
                className="special-title"
                style={{ color: config.color }}
              >{e.title}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  render() {
    const { visible } = this.state
    if (!visible) {
      return null
    }
    const { language, fontFamily } = this.props
    const config = this.getConfig()
    return (
      <Modal
        zIndex={10}
        style={{ top: 120 }}
        className={config.mask}
        title={null}
        maskClosable={false}
        closable={false}
        visible
        footer={null}
        width={340}
      >
        <div style={{ fontFamily: getFontFamily(fontFamily) }}>
          <div className="pic-edit-header">
            <span className="pic-edit-title" style={{ color: config.color }}>
              {localWithKey(language, 'publish-post')}
            </span>
            <i
              className="iconfont icon-guanbi pic-edit-close"
              onClick={() => this.hide()}
            />
          </div>
          <div
            className="pic-edit-content"
            style={{ color: config.color }}
          >
            {localWithKey(language, 'bind-special')}
          </div>
          <div
            className="pic-edit-search-cover"
            style={{ borderBottom: config.border }}
          >
            <i
              className="iconfont icon-search pic-edit-search"
              style={{ color: config.color }}
            />
            <input
              id="input"
              onChange={e => this.getSpecialByKey(e.target.value)}
              className="pic-edit-input"
              placeholder={localWithKey(language, 'search-special-holder')}
              style={{ color: config.color }}
            />
            {this.renderList(config)}
          </div>
          <div
            className="pic-edit-tool"
            style={{
              display: 'flex',
              marginTop: 10,
              paddingBottom: 20,
              justifyContent: 'flex-end',
            }}
          >
            <span
              className="ok"
              onClick={() => this.doneClick()}
            >
              {localWithKey(language, 'done')}
            </span>
          </div>
        </div>
      </Modal>
    )
  }
}
