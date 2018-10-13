import * as React from 'react'
import { EFontFamily, EFontColor, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import { getFontFamily } from '../../utils/font'
import * as instance from '../../utils/instance'
import localWithKey from '../../language'

export enum EEmptyTypes {
  NORMAL = 0,
  DELETE
}

export interface IEmptyProps {
  fontFamily?: EFontFamily
  fontColor?: EFontColor
  language?: ELanguageEnv
  mode?: ESystemTheme
  type?: EEmptyTypes
}

export default class Empty extends React.Component<IEmptyProps> {
  getErrorConfig() {
    let res
    const { mode } = this.props
    if (mode === ESystemTheme.day) {
      res = {
        border: '1px solid #babbbc',
        color: '#333333',
        tool: '#b4b4b4',
        bj: '#EFF2F5',
        detailColor: '#333333'
      }
    } else {
      res = {
        border: '1px solid #2F2F2F',
        color: '#c8c8c8',
        tool: '#969696',
        bj: '#4F4F4F',
        detailColor: '#C0C0C0'
      }
    }
    return res
  }

  render() {
    const config = this.getErrorConfig()
    const { fontFamily, language, type } = this.props
    return (
      <div
        className="p-error"
        style={{ fontFamily: getFontFamily(fontFamily) }}
      >
        <div
          className="p-error-tip"
          style={{ color: config.color }}
        >
          <i className="iconfont icon-yun p-error-logo" />
          <span className="p-error-404">- 404</span>
        </div>
        <div
          className="p-error-content"
          style={{ border: config.border, background: config.bj }}
        >
          <div
            className="p-error-title"
            style={{ color: config.color }}
          >{
              type === EEmptyTypes.NORMAL ?
                localWithKey(language, 'post-detail-error') :
                localWithKey(language, 'unluck')
            }</div>
          <div
            className="p-error-detail"
            style={{ borderBottom: config.border, color: config.detailColor }}
          >{
              type === EEmptyTypes.NORMAL ?
                localWithKey(language, 'post-detail-source') :
                localWithKey(language, 'post-deleted')
            }</div>
          <div
            className="p-error-footer"
            style={{ color: config.color }}
          >
            <span
              className="p-error-link"
              onClick={() => instance.getValueByKey('history').replace('/')}
            >{localWithKey(language, 'back-home')}</span>
            {localWithKey(language, 'or')}
            <span
              className="p-error-link"
              onClick={() => instance.getValueByKey('history').goBack()}
            >{localWithKey(language, 'previous-page')}</span>
          </div>
        </div>
      </div>
    )
  }
}
