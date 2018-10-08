import * as React from 'react'
import { ESystemTheme, ELanguageEnv, EFontFamily } from '../../reducer/main'
import { getFontFamily } from '../../utils/font';

export interface IPersonPreviewProps {
  mode?: ESystemTheme
  language?: ELanguageEnv
  fontFamily?: EFontFamily
}

export interface IPersonPreviewState {
  visible: boolean
  x?: number
  y?: number
}

export default class PersonPreview extends React.Component<IPersonPreviewProps, IPersonPreviewState> {
  constructor(props: IPersonPreviewProps) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  getConfig() {
    let res
    const { mode } = this.props
    if (mode === ESystemTheme.day) {
      res = {
        border: '1px solid #F0F0F0',
        color: '#333333',
        coverBorder: '3px solid #FFFFFF',
        bodyClass: 'person-preview-day'
      }
    } else {
      res = {
        border: '1px solid #2F2F2F',
        color: '#c8c8c8',
        coverBorder: '3px solid #3f3f3f',
        bodyClass: 'person-preview-night'
      }
    }
    return res
  }

  render() {
    const { fontFamily } = this.props
    const config = this.getConfig()
    return (
      <div
        id="person-preview"
        className={config.bodyClass}
        style={{
          color: config.color,
          fontFamily: getFontFamily(fontFamily),
        }}
      >
        <img className="preview-cover" src="http://127.0.0.1:9988/storage/da3dcb1d3fc825e167c72e5b69fb5f56.jpg" />
        <div className="preview-user">
          <img
            className="preview-avatar"
            src="http://127.0.0.1:9988/storage/bfe42ae1fb7a8c0849a0b22ccbf743db.jpg"
            style={{ border: config.coverBorder }}
          />
          <div className="preview-info">
            <span className="name">hello</span>
            <span className="what-is-up">哈哈😀</span>
          </div>
        </div>
        <div
          className="preview-tips"
          style={{ borderTop: config.border }}
        >
          <div className="tip-item">
            <span className="k">回答</span>
            <span className="v" style={{ color: config.color }}>11</span>
          </div>
          <div className="tip-item">
            <span className="k">回答</span>
            <span className="v" style={{ color: config.color }}>11</span>
          </div>
          <div className="tip-item">
            <span className="k">回答</span>
            <span className="v" style={{ color: config.color }}>11</span>
          </div>
        </div>
        <div className="preview-footer">
          <div className="btn follow">
            <i className="iconfont icon-jia icon" />
            关注Ta
          </div>
          <div className="btn message">
            <i className="iconfont icon-xiaoxi icon" />
            发私信
          </div>
        </div>
      </div>
    )
  }
}
