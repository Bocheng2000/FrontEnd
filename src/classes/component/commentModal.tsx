import * as React from 'react'
import Modal from 'antd/lib/modal'
import Tooltip from 'antd/lib/tooltip'
import { Link } from 'react-router-dom'
import { ESystemTheme, ELanguageEnv, EFontFamily } from '../../reducer/main'
import localWithKey from '../../language'
import Loading from './loading'
import { list, create, del, IListResponse, ECommentState, ICommentChildModel } from '../../http/comment'
import { ILoginResponse } from '../../http/user'
import * as instance from '../../utils/instance'
import { page_size, animate_delay } from '../../utils/config'
import { showTips } from '../../utils/tips'
import { getHashUrl } from '../../utils/http'
import { parseNumber, dateDiff } from '../../utils/utils'

export interface ICommentModelProps {
  ref?: (e: CommentModel) => void
  mode?: ESystemTheme
  language?: ELanguageEnv
  fontFamily?: EFontFamily
}

export interface ICommentModelParams {
  objectId: string
  commentCount: number
}

interface ICommentModelState {
  textAreaHeight: number
  visible: boolean
  more: boolean
  comments: Array<IListResponse>
}

export default class CommentModel extends React.Component<ICommentModelProps, ICommentModelState> {
  private objectId: string
  private commentCount: number
  private timer: any
  private isRequest: boolean = false

  constructor(props: ICommentModelProps) {
    super(props)
    this.state = {
      textAreaHeight: 20,
      visible: false,
      more: true,
      comments: undefined
    }
  }

  public show(params: ICommentModelParams) {
    this.objectId = params.objectId
    this.commentCount = params.commentCount
    this.setState({ visible: true, textAreaHeight: 20 })
    this.findComment()
  }

  private hide() {
    this.timer && clearTimeout(this.timer)
    this.setState({
      textAreaHeight: 20,
      visible: false,
      more: true,
      comments: undefined
    })
  }

  private findComment() {
    if (this.isRequest) return
    let user = this.findUser()
    const { comments } = this.state
    let maxId: string = ''
    if (comments && comments.length) {
      maxId = comments[comments.length - 1].comment.id
    }
    this.isRequest = true
    this.timer = setTimeout(() => {
      list({
        userId: user ? user.id : undefined,
        objectId: this.objectId,
        maxId,
        pageSize: page_size,
        nextLvlSize: 2,
      }, (err, data) => {
        this.isRequest = false
        if (err) {
          showTips(err)
          if (maxId === '') {
            this.setState({ comments: [], more: true })
          }
        } else {
          if (maxId === '') {
            this.setState({ comments: data, more: data.length >= page_size })
          } else {
            this.setState({ comments: comments.concat(data), more: data.length >= page_size })
          }
        }
      })
    }, animate_delay)
  }

  private findUser(): ILoginResponse {
    let user = instance.getValueByKey('info')
    if (user)
      return user as ILoginResponse
    return undefined
  }

  private getConfig() {
    const { mode } = this.props
    let config
    if (mode === ESystemTheme.night) {
      config = {
        mask: 'base-model-night',
        color: '#C8C8C8',
        border: '1px solid #2F2F2F',
        content: 'content-night',
      }
    } else {
      config = {
        mask: 'base-model-day',
        color: '#333333',
        border: '1px solid #DDDDDD',
        content: 'content-day',
      }
    }
    return config
  }

  private reseize() {
    const obj = document.getElementById('c-i')
    obj.style.height = 'auto'
    const scrollHeight = obj.scrollHeight
    if (scrollHeight <= 100) {
      obj.style.height = `${scrollHeight}px`
      const { textAreaHeight } = this.state
      if (scrollHeight !== textAreaHeight) {
        this.setState({ textAreaHeight: scrollHeight })
      }
    } else {
      obj.style.height = '100px'
    }
  }

  /**
   * 没有数据是渲染空的列表
   */
  private renderSofa() {
    return (
      <div className="c-e">
        <i className="iconfont icon-shafa icon" />
        <span className="c-e-h">抢沙发</span>
      </div>
    )
  }

  /**
   * 渲染加载中
   */
  private renderLoading() {
    return <Loading />
  }

  renderNext(config: any, children: Array<ICommentChildModel>, language: ELanguageEnv) {
    if (!children || children.length === 0) return null
    return (
      children.map(e => {
        return (
          <div className="c-item c-clear" key={e.comment.id} style={{ borderTop: config.border }}>
            <img className="c-a" src={getHashUrl(e.comment.avatar)} />
            <div className="c-b">
              <div className="c-g">
                <div>
                  <Link to={`/u/${e.comment.userId}`}>
                    <span className="name" style={{ color: config.color }}>{e.comment.name}</span>
                  </Link>
                  <span className="a-reply">
                    {localWithKey(language, 'reply')}
                  </span>
                  <Link to={`/u/${e.comment.userId}`}>
                    <span className="name" style={{ color: config.color }}>{e.parent.name}</span>
                  </Link>
                </div>
                <Tooltip placement="bottom" title={`${localWithKey(language, 'created-at')} ${e.comment.createdAt}`}>
                  <span className="a-ts">{dateDiff(e.comment.createdAt)}</span>
                </Tooltip>
              </div>
              <div className="c-c" style={
                e.comment.state === ECommentState.DELETED
                  ? { textDecoration: 'line-through' }
                  : undefined}
              >
                {e.comment.state === ECommentState.DELETED
                  ? localWithKey(language, 'comment-deleted') : e.comment.content}
              </div>
              {
                e.comment.images.length ?
                  (
                    <div className={`c-i-c ${config.content}`} style={{ width: 607 }}>
                      {
                        e.comment.images.map((elem, i) => <img className="c-i" key={i} src={getHashUrl(elem.image)} />)
                      }
                    </div>
                  ) : null
              }
              <div className="c-i-t">
                <span className="c-i-item">
                  <i className="iconfont icon-dianzan icon rotate" />
                  {parseNumber(e.comment.likeCount)}
                </span>
                <span className="c-i-item none">
                  <i className="iconfont icon-icon_reply icon" />
                  {localWithKey(language, 'reply')}
                </span>
                <span className="c-i-item none">
                  <i className="iconfont icon-icon_tip_off icon" />
                  {localWithKey(language, 'to-report')}
                </span>
              </div>
            </div>
          </div>
        )
      })
    )
  }

  private renderBody(config: any) {
    const { comments } = this.state
    if (!comments) return this.renderLoading()
    if (comments.length === 0) return this.renderSofa()
    return this.renderComment(config)
  }

  private renderItem(config: any, e: IListResponse, language: ELanguageEnv) {
    const { comment } = e
    return (
      <div className="c-item" key={comment.id} style={{ borderTop: config.border }}>
        <img className="c-a" src={getHashUrl(comment.avatar)} />
        <div className="c-b">
          <div className="c-g">
            <span className="name">{comment.name}</span>
            <Tooltip placement="bottom" title={`${localWithKey(language, 'created-at')} ${comment.createdAt}`}>
              <span className="a-ts">{dateDiff(comment.createdAt)}</span>
            </Tooltip>
          </div>
          <div
            className="c-c"
            style={comment.state === ECommentState.DELETED
              ? { textDecoration: 'line-through' }
              : undefined}
          >
            {comment.state === ECommentState.DELETED
              ? localWithKey(language, 'comment-deleted') : comment.content}
          </div>
          {
            comment.images.length ?
              (
                <div className={`c-i-c ${config.content}`} style={{ width: 607 }}>
                  {
                    comment.images.map((e, i) => <img className="c-i" key={i} src={getHashUrl(e.image)} />)
                  }
                </div>
              ) : null
          }
          <div className="c-i-t">
            <span className="c-i-item">
              <i
                className="iconfont icon-dianzan icon rotate"
                style={{ color: comment.isLike ? 'red' : '#8590a6' }}
              />
              {parseNumber(comment.likeCount)}
            </span>
            <span className="c-i-item none">
              <i className="iconfont icon-icon_reply icon" />
              {localWithKey(language, 'reply')}
            </span>
            <span className="c-i-item none">
              <i className="iconfont icon-icon_tip_off icon" />
              {localWithKey(language, 'to-report')}
            </span>
          </div>
          {this.renderNext(config, e.children, language)}
        </div>
      </div>
    )
  }

  private renderComment(config: any) {
    const { comments } = this.state
    const { language } = this.props
    return comments.map(e => this.renderItem(config, e, language))
  }

  render() {
    const { visible, textAreaHeight } = this.state
    if (!visible) return null
    const clientHeihgt = document.documentElement.clientHeight
    const modalHeight = clientHeihgt - 40
    const width = 690
    const config = this.getConfig()
    const { language } = this.props
    return (
      <Modal
        zIndex={10}
        className={config.mask}
        title={null}
        maskClosable={false}
        closable={false}
        centered
        visible
        footer={null}
        width={width}
      >
        <div
          id="comment-modal"
          className={config.content}
          style={{ height: modalHeight, width: width - 1, color: config.color }}
        >
          <div className="c-header" style={{ borderBottom: config.border }}>
            <span className="c-title">
              {`${this.commentCount} 条评论`}
            </span>
            <i
              className="iconfont icon-guanbi c-close"
              onClick={() => this.hide()}
            />
          </div>
          <div
            className={`c-body ${config.content}`}
            style={{ height: modalHeight - 41 - 1 - textAreaHeight - 16 - 24 }}
          >
            {this.renderBody(config)}
          </div>
          <div className="c-footer" style={{ borderTop: config.border }}>
            <div className="c-f-c" style={{ border: config.border, height: textAreaHeight + 16 }}>
              <textarea
                placeholder={localWithKey(language, 'write-comment')}
                id="c-i"
                rows={1}
                className={`c-f-i ${config.content}`}
                style={{ height: textAreaHeight }}
                onChange={e => this.reseize()}
                onCut={() => this.reseize()}
                onPaste={() => this.reseize()}
                onDrop={() => this.reseize()}
              />
              <i className="iconfont icon-biaoqing icon" />
              <i className="iconfont icon-ai-camera icon" />
            </div>
            <span className="c-f-s">
              发布
            </span>
          </div>
        </div>
      </Modal>
    )
  }
}
