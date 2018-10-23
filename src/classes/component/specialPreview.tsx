import * as React from 'react'
import { ESystemTheme, ELanguageEnv, EFontFamily } from '../../reducer/main'
import { IFindPreviewResponse, findPreview } from '../../http/special'
import localWithKey from '../../language'
import * as instance from '../../utils/instance'
import { ILoginResponse } from '../../http/user'
import { getFontFamily } from '../../utils/font'
import Loading from '../component/loading'
import { animate_delay } from '../../utils/config'
import { getHashUrl } from '../../utils/http';
import { parseNumber } from '../../utils/utils'
import { createOrDel, EFollowType } from '../../http/follow'
import { showTips } from '../../utils/tips';

export interface IPersonPreviewProps {
  ref?: (e: SpecialPreview) => void
  mode?: ESystemTheme
  language?: ELanguageEnv
  fontFamily?: EFontFamily
}

interface ISpecialPreviewState {
  isLoading: boolean
  visible: boolean
  targetId: string
  info?: IFindPreviewResponse
  handler?: (isFollow: boolean) => void
}

export interface ISpecialPreviewParams {
  x: number
  y: number
  targetId: string
  handler?: (isFollow: boolean) => void
}

export default class SpecialPreview extends React.Component<IPersonPreviewProps, ISpecialPreviewState> {
  private timer: any
  private loadingTimer: any
  private x: number
  private y: number
  private userId: string
  private isRequest: boolean = false
  constructor(props: IPersonPreviewProps) {
    super(props)
    this.state = {
      isLoading: false,
      visible: false,
      targetId: '',
      info: undefined,
      handler: undefined
    }
  }

  public show(params: ISpecialPreviewParams) {
    this.timer && clearTimeout(this.timer)
    const { visible } = this.state
    this.y = params.y
    this.x = params.x
    if (!visible) {
      let userId: string = undefined
      let user = instance.getValueByKey('info')
      if (user) {
        userId = (user as ILoginResponse).id
      }
      this.userId = userId
      this.setState({
        visible: true,
        isLoading: true,
        targetId: params.targetId,
        handler: params.handler,
      })
    }
    this.findPreview()
  }

  public hide() {
    this.timer && clearTimeout(this.timer)
    this.loadingTimer && clearTimeout(this.loadingTimer)
    this.timer = setTimeout(() => {
      this.setState({
        isLoading: false,
        visible: false,
        targetId: '',
        info: undefined,
        handler: undefined
      })
    }, 200)
  }

  findPreview() {
    this.loadingTimer && clearTimeout(this.loadingTimer)
    this.loadingTimer = setTimeout(() => {
      const { targetId } = this.state
      findPreview({
        userId: this.userId,
        id: targetId,
      }, (err, data) => {
        if (err || !data) {
          this.hide()
        } else {
          this.setState({
            isLoading: false,
            info: data,
          })
        }
      })
    }, animate_delay)
  }

  followOrNot() {
    const { language } = this.props
    if (!this.userId) {
      showTips(localWithKey(language, 'login-first'))
      return
    }
    if (this.isRequest) return
    this.isRequest = true
    let user = instance.getValueByKey('info') as ILoginResponse
    const { targetId, info, handler } = this.state
    createOrDel({
      id: user.id,
      token: user.token,
      objectId: targetId,
      type: EFollowType.SPECIAL,
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
      } else {
        this.setState({
          info: {
            ...info,
            isFollow: !info.isFollow,
            followerCount: info.isFollow ? info.followerCount - 1 : info.followerCount + 1,
          },
        })
        handler && handler(!info.isFollow)
      }
    })
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
    const { visible, isLoading, info, targetId, handler } = this.state
    if (!visible) return null
    const config = this.getConfig()
    if (isLoading) {
      return (
        <div
          id="person-preview"
          className={config.bodyClass}
          style={{
            paddingTop: '10px',
            top: `${this.y}px`,
            left: `${this.x}px`
          }}
          onMouseEnter={() => this.show({ y: this.y, targetId, x: this.x, handler })}
          onMouseLeave={() => this.hide()}
        >
          <Loading />
        </div>
      )
    }
    const { language, fontFamily } = this.props
    return (
      <div
        id="person-preview"
        className={config.bodyClass}
        style={{
          color: config.color,
          fontFamily: getFontFamily(fontFamily),
          top: `${this.y}px`,
          left: `${this.x}px`
        }}
        onMouseEnter={() => this.show({ y: this.y, targetId, x: this.x, handler })}
        onMouseLeave={() => this.hide()}
      >
        <div className="preview-user">
          <img
            className="preview-avatar"
            src={getHashUrl(info.avatar)}
            style={{ border: config.coverBorder }}
          />
          <div className="preview-info" style={{ fontSize: 15 }}>
            {info.title}
          </div>
        </div>
        {
          info.introduction ?
            <div className="preview-introduction" style={{ borderBottom: config.border }}>
              {info.introduction}
            </div> : null
        }
        <div className="preview-items">
          <div className="p-item">
            <div className="p-tag">
              {localWithKey(language, 'question-list')}
            </div>
            <div className="p-count">
              {parseNumber(info.questionCount)}
            </div>
          </div>
          <div className="p-item">
            <div className="p-tag">
              {localWithKey(language, 'to-share')}
            </div>
            <div className="p-count">
              {parseNumber(info.shareCount)}
            </div>
          </div>
          <div className="p-item">
            <div className="p-tag">
              {localWithKey(language, 'follower-count')}
            </div>
            <div className="p-count">
              {parseNumber(info.followerCount)}
            </div>
          </div>
        </div>
        <div className="preview-footer" style={{ justifyContent: 'center' }}>
          <div className="btn follow" onClick={() => this.followOrNot()}>
            <i className={`iconfont ${info.isFollow ? 'icon-jian' : 'icon-jia'} icon`} />
            {localWithKey(language, info.isFollow ? 'unfollow' : 'follow-special')}
          </div>
        </div>
      </div>
    )
  }
}
