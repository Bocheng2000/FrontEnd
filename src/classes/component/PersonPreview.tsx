import * as React from 'react'
import { ESystemTheme, ELanguageEnv, EFontFamily } from '../../reducer/main'
import { getFontFamily } from '../../utils/font'
import { listPreview, IListPreviewResponse } from '../../http/home'
import { animate_delay } from '../../utils/config'
import Loading from '../component/loading'
import { getHashUrl } from '../../utils/http'
import localWithKey from '../../language';
import { parseNumber } from '../../utils/utils'
import * as instance from '../../utils/instance'
import { ILoginResponse } from '../../http/user'
import { showTips, EShowTipsType } from '../../utils/tips'
import { createOrDel, EFollowType } from '../../http/follow'

export interface IPersonPreviewProps {
  ref?: (e: PersonPreview) => void
  mode?: ESystemTheme
  language?: ELanguageEnv
  fontFamily?: EFontFamily
}

export interface IPersonPreviewState {
  isLoading: boolean
  visible: boolean
  targetId: string
  userId: string
  info?: IListPreviewResponse
  handler?: (isFollow: boolean) => void
}

export interface IShowParams {
  x: number
  y: number
  targetId: string
  handler?: (isFollow: boolean) => void
}

export default class PersonPreview extends React.Component<IPersonPreviewProps, IPersonPreviewState> {
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
      userId: '',
      info: undefined
    }
  }

  public show(params: IShowParams) {
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
        userId: this.userId,
        info: undefined,
        handler: params.handler
      })
    }
    this.personInfo(this.userId, params.targetId)
  }

  private personInfo(userId: string, targetId: string) {
    this.loadingTimer && clearTimeout(this.loadingTimer)
    this.loadingTimer = setTimeout(() => {
      listPreview({
        userId: userId,
        targetId: targetId,
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

  public hide() {
    this.timer && clearTimeout(this.timer)
    this.loadingTimer && clearTimeout(this.loadingTimer)
    this.timer = setTimeout(() => {
      this.setState({
        isLoading: true,
        visible: false,
        targetId: '',
        userId: '',
        info: undefined,
        handler: undefined
      })
    }, 200)
  }

  private followOrNot() {
    if (this.isRequest) return
    const { language } = this.props
    if (!this.userId) {
      showTips(localWithKey(language, 'login-first'))
      return
    }
    const { targetId, handler } = this.state
    const user = instance.getValueByKey('info') as ILoginResponse
    this.isRequest = true
    createOrDel({
      id: user.id,
      token: user.token,
      objectId: targetId,
      type: EFollowType.USER,
    }, (err) => {
      this.isRequest = false
      const { info } = this.state
      if (err) {
        showTips(err)
        handler && handler(info.isFollow)
      } else {
        showTips(localWithKey(language, 'follow-done'), EShowTipsType.success)
        handler && handler(!info.isFollow)
        this.setState({
          info: {
            ...info,
            isFollow: !info.isFollow,
            followerCount: info.isFollow ? info.followerCount - 1 : info.followerCount + 1,
          }
        })
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
    const { isLoading, visible, info, targetId, handler } = this.state
    if (!visible) {
      return null
    }
    const { fontFamily, language, mode } = this.props
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
    return (
      <div
        id="person-preview"
        className={config.bodyClass}
        onMouseEnter={() => this.show({ y: this.y, targetId, x: this.x, handler })}
        onMouseLeave={() => this.hide()}
        style={{
          color: config.color,
          fontFamily: getFontFamily(fontFamily),
          top: `${this.y}px`,
          left: `${this.x}px`
        }}
      >
        {
          info.cover
            ? <img className="preview-cover" src={getHashUrl(info.cover)} />
            : null
        }
        <div className="preview-user">
          <img
            className="preview-avatar"
            src={getHashUrl(info.avatar)}
            style={{ border: config.coverBorder }}
          />
          <div className="preview-info">
            <span className="name">{info.name}</span>
            <span className="what-is-up">{info.whatIsUp}</span>
          </div>
        </div>
        <div
          className="preview-tips"
          style={{ borderTop: config.border }}
        >
          <div className="tip-item">
            <span className="k">
              {localWithKey(language, 'answer-count')}
            </span>
            <span className="v" style={{ color: config.color }}>
              {parseNumber(info.answerCount)}
            </span>
          </div>
          <div className="tip-item">
            <span className="k">{localWithKey(language, 'post-count')}</span>
            <span className="v" style={{ color: config.color }}>
              {parseNumber(info.postCount)}
            </span>
          </div>
          <div className="tip-item">
            <span className="k">{localWithKey(language, 'follower-count')}</span>
            <span className="v" style={{ color: config.color }}>
              {parseNumber(info.followerCount)}
            </span>
          </div>
        </div>
        <div className="preview-footer">
          <div
            className="btn follow"
            style={(this.userId && this.userId === info.id) ? { cursor: 'not-allowed' } : undefined}
            onClick={(this.userId && this.userId === info.id) ? null : () => this.followOrNot()}
          >
            <i className={`iconfont ${info.isFollow ? 'icon-jian' : 'icon-jia'} icon`} />
            {localWithKey(language, info.isFollow ? 'unfollow' : 'follow-ta')}
          </div>
          <div className="btn message">
            <i className="iconfont icon-xiaoxi icon" />
            {localWithKey(language, 'message')}
          </div>
        </div>
      </div>
    )
  }
}
