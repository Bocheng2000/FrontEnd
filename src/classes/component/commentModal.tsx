import * as React from 'react'
import Modal from 'antd/lib/modal'
import Popover from 'antd/lib/popover'
import Tooltip from 'antd/lib/tooltip'
import { Link } from 'react-router-dom'
import { ESystemTheme, ELanguageEnv, EFontFamily } from '../../reducer/main'
import localWithKey from '../../language'
import Loading from './loading'
import {
  list, create, del, IListResponse, ECommentState,
  ICommentChildModel, ECommentType, ICommentImageModel,
  ICreateResponse, ICommentModel, nextLvl
} from '../../http/comment'
import { ILoginResponse } from '../../http/user'
import * as instance from '../../utils/instance'
import {
  page_size, animate_delay, emoji_regex,
  at_regex, tag_regex, avatar_w, avatar_h,
} from '../../utils/config'
import { showTips, EShowTipsType } from '../../utils/tips'
import { getHashUrl } from '../../utils/http'
import { parseNumber, dateDiff } from '../../utils/utils'
import PersonPreview from './PersonPreview'
import EmojiTab from './emojiTab'
import { createOrDel, EFollowType } from '../../http/follow'
import { EReportType } from '../../http/report'
import Confirm, { EConfirmTypes } from './confirm'
import Report, { IReportOptions } from './report'
import PicEditor from './picEditor'
import { upload } from '../../http/upload'
import Sofa from './sofa'

export interface ICommentModelProps {
  ref?: (e: CommentModel) => void
  mode?: ESystemTheme
  language?: ELanguageEnv
  fontFamily?: EFontFamily
}

export interface ICommentModelParams {
  objectId: string
  type: ECommentType
  commentCount: number
  submitCommentHandler?: (id: string, type: ECommentType) => void
}

interface ICommentModelState {
  textAreaHeight: number
  visible: boolean
  more: boolean
  isLoading: boolean
  comments: Array<IListResponse>
  value: string
  placeholder: string
  rootId: string
  parentId: string
  images: Array<ICommentImageModel>
}

export default class CommentModel extends React.Component<ICommentModelProps, ICommentModelState> {
  private objectId: string
  private type: ECommentType
  private preview: PersonPreview
  private commentCount: number
  private submitCommentHandler: (id: string, type: ECommentType) => void
  private timer: any
  private user = this.findUser()
  private confirm: Confirm
  private report: Report
  private editor: PicEditor


  private isRequest: boolean = false

  constructor(props: ICommentModelProps) {
    super(props)
    this.state = {
      textAreaHeight: 20,
      visible: false,
      more: true,
      isLoading: false,
      comments: undefined,
      value: '',
      placeholder: localWithKey(props.language, 'write-comment'),
      rootId: '',
      parentId: '',
      images: [],
    }
  }

  componentDidUpdate() {
    const $link = $('.comment-link')
    $link.off('click')
    $link.on('click', function () {
      const $this = $(this)
      if ($this.hasClass('comment-name')) {
        console.log('name')
        return
      }
      if ($this.hasClass('comment-tag')) {
        console.log('tag')
        return
      }
    })
  }

  clear() {
    const { language } = this.props
    this.setState({
      value: '',
      placeholder: localWithKey(language, 'write-comment'),
      rootId: '',
      parentId: '',
      images: [],
    })
  }

  emojiDidTap(title: string) {
    const { value } = this.state
    this.setState({ value: `${value}${title}` })
    this.reseize()
  }

  public show(params: ICommentModelParams) {
    this.objectId = params.objectId
    this.type = params.type
    this.commentCount = params.commentCount
    this.submitCommentHandler = params.submitCommentHandler
    this.setState({ visible: true, textAreaHeight: 20 })
    this.findComment()
  }

  private publishDidClick() {
    if (this.isRequest) return
    const user = this.user
    const { language } = this.props
    if (!user) {
      showTips(localWithKey(language, 'login-first'))
      return
    }
    let { value, rootId, parentId, images } = this.state
    value = value.trim()
    if (value.length === 0) {
      showTips(localWithKey(language, 'input-comment'))
      return
    }
    this.isRequest = true
    create({
      id: user.id, token: user.token,
      objectId: this.objectId, type: this.type,
      content: value, images,
      parentId, rootId,
    }, (err, data) => {
      this.isRequest = false
      if (err) {
        showTips(err)
      } else {
        this.submitCommentHandler && this.submitCommentHandler(this.objectId, this.type)
        this.commentCount++
        showTips(localWithKey(language, 'submit-success'), EShowTipsType.success)
        this.insertCommentAt(data, user)
      }
    })
  }

  private insertCommentAt(data: ICreateResponse, user: ILoginResponse) {
    let { value, rootId, parentId, images, comments } = this.state
    value = value.trim()
    const comment: ICommentModel = {
      avatar: user.avatar,
      childCount: 0,
      content: value,
      createdAt: data.createdAt,
      id: data.id,
      images,
      isLike: false,
      likeCount: 0,
      name: user.name,
      rootId,
      state: ECommentState.NORMAL,
      type: this.type,
      userId: user.id,
      ignore: true,
    }
    if (rootId === '' && parentId === '') {
      comments.unshift({
        comment,
      })
      this.setState({ comments })
      $('.c-body').animate({ scrollTop: 0 }, 250)
    } else {
      for (let i = 0; i < comments.length; i++) {
        const o = comments[i]
        if (rootId === o.comment.id) {
          if (!o.children)
            o.children = []
          o.comment.childCount++
          o.children.push({
            comment,
            parent: o.comment,
          })
          this.setState({ comments })
          break
        }
      }
    }
    this.clear()
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

  loadNextComment(children: Array<ICommentChildModel>, pageSize: number) {
    if (this.isRequest) return
    this.isRequest = true
    let userId
    if (this.user) userId = this.user.id
    let lastObject = undefined
    for (let i = children.length - 1; i > -1; i--) {
      if (!children[i].comment.ignore) {
        lastObject = children[i]
        break
      }
    }
    if (!lastObject) {
      this.isRequest = false
      return
    }
    const { rootId } = lastObject.comment
    nextLvl({
      userId,
      rootId,
      sinceId: lastObject.comment.id,
      pageSize,
    }, (err, data) => {
      this.isRequest = false
      if (!err && data && data.length) {
        const { comments } = this.state
        for (let i = 0; i < comments.length; i++) {
          const o = comments[i]
          if (o.comment.id === rootId) {
            if (o.children) {
              let index = -1
              for (let j = 0; j < o.children.length; j++) {
                if (o.children[j].comment.ignore) {
                  if (index === -1)
                    index = j
                  o.children[j].comment.ignore = false
                }
              }
              const group1 = o.children.splice(0, index)
              o.children = group1.concat(data).concat(o.children)
              this.setState({ comments })
            }
            break
          }
        }
      }
    })
  }

  private findComment() {
    if (this.isRequest) return
    let user = this.user
    const { comments } = this.state
    let maxId: string = ''
    if (comments && comments.length) {
      maxId = comments[comments.length - 1].comment.id
    }
    this.isRequest = true
    this.setState({ isLoading: true })
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
            this.setState({ comments: [], more: true, isLoading: false })
          } else {
            this.setState({ isLoading: false })
          }
        } else if (maxId === '') {
          this.setState({ comments: data, more: data.length >= page_size, isLoading: false })
        } else {
          this.setState({ comments: comments.concat(data), more: data.length >= page_size, isLoading: false })
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
        linkClass: 'comment-link-night'
      }
    } else {
      config = {
        mask: 'base-model-day',
        color: '#333333',
        border: '1px solid #DDDDDD',
        content: 'content-day',
        linkClass: 'comment-link'
      }
    }
    return config
  }

  private reseize() {
    const obj = document.getElementById('c-i') as HTMLTextAreaElement
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

  showPreview(evt: React.MouseEvent, userId: string) {
    const target = evt.target as HTMLElement
    this.preview.show({
      x: target.offsetLeft,
      y: target.offsetTop + 30 - $('.c-body').scrollTop(),
      targetId: userId,
    })
  }

  private regexComment(html: string, config: any): string {
    let emoji = require('../../file/emoji.json') as Array<any>
    html = html.replace(emoji_regex, (a) => {
      const title = a.replace('[:', '').replace(':]', '')
      for (let i = 0; i < emoji.length; i++) {
        if (emoji[i].title === title) {
          return `<img src=${getHashUrl(emoji[i].src)} class="comment-emoji" />`
        }
      }
      return a
    })
    html = html.replace(at_regex, (a) => {
      return `<span class="${config.linkClass} comment-name">${a.trim()}</span>`
    })
    html = html.replace(tag_regex, (a) => {
      return `<span class="${config.linkClass} comment-tag">${a.trim()}</span>`
    })
    return html
  }

  resetDidClick() {
    const { language } = this.props
    this.clear()
    this.reseize()
    showTips(localWithKey(language, 'reset-success'), EShowTipsType.warning)
  }

  toReply(comment: ICommentModel) {
    let rootId = comment.id
    if (comment.rootId)
      rootId = comment.rootId
    const { language } = this.props
    this.setState({
      rootId,
      parentId: comment.id,
      placeholder: `${localWithKey(language, 'reply')} ${comment.name}:`,
      value: '',
      images: [],
    })
  }

  toLike(comment: ICommentModel) {
    if (this.isRequest) return
    const { comments } = this.state
    if (!this.user) {
      const { language } = this.props
      showTips(localWithKey(language, 'login-first'))
      return
    }
    createOrDel({
      id: this.user.id,
      token: this.user.token,
      objectId: comment.id,
      type: EFollowType.COMMENT,
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
        return
      }
      let rootId = comment.rootId
      if (rootId) {
        for (let i = 0; i < comments.length; i++) {
          const o = comments[i]
          if (o.comment.id === rootId) {
            if (o.children) {
              for (let j = 0; j < o.children.length; j++) {
                const oo = o.children[j]
                if (oo.comment.id === comment.id) {
                  if (comment.isLike) {
                    oo.comment.isLike = false
                    oo.comment.likeCount = comment.likeCount - 1
                  } else {
                    oo.comment.isLike = true
                    oo.comment.likeCount = comment.likeCount + 1
                  }
                  this.setState({ comments })
                  break
                }
              }
            }
            break
          }
        }
      } else {
        for (let i = 0; i < comments.length; i++) {
          const o = comments[i]
          if (o.comment.id === comment.id) {
            if (comment.isLike) {
              o.comment.isLike = false
              o.comment.likeCount = comment.likeCount - 1
            } else {
              o.comment.isLike = true
              o.comment.likeCount = comment.likeCount + 1
            }
            this.setState({ comments })
            break
          }
        }
      }
    })
  }

  toDel(comment: ICommentModel) {
    if (this.isRequest) return
    const { language } = this.props
    if (!this.user) {
      showTips(localWithKey(language, 'login-first'))
      return
    }
    this.confirm.show({
      type: EConfirmTypes.CONFIRM,
      title: localWithKey(language, 'del-comment-confirm'),
      content: localWithKey(language, 'del-comment-content'),
      cancel: {
        title: localWithKey(language, 'cancel')
      },
      ok: {
        title: localWithKey(language, 'continue'),
        handler: () => this.deleteComment(comment),
      }
    })
  }

  toPickerFile(e: React.ChangeEvent) {
    const file = (e.target as HTMLInputElement).files[0]
    if (!file) return
    var reader = new FileReader()
    reader.onloadend = (e: any) => {
      const targegt = document.getElementById('picker') as HTMLInputElement
      targegt.value = ''
      this.editor.show({
        image: (e.target as any).result,
        width: avatar_w,
        height: avatar_h,
        handler: (err, result) => {
          if (err)
            showTips(err)
          else
            this.uploadImage(result)
        }
      })
    }
    reader.readAsDataURL(file)
  }

  uploadImage(base64: string) {
    const buffer = new Buffer(base64.split(',')[1], 'base64')
    upload('jpg', buffer, (err, hash) => {
      if (err || !hash) {
        const { language } = this.props
        showTips(err || localWithKey(language, 'upload-failed'))
      } else {
        const { images } = this.state
        images.push({ image: hash, w: avatar_w, h: avatar_h })
        this.setState({ images })
      }
    })
  }

  deleteComment(comment: ICommentModel) {
    del({
      id: this.user.id,
      token: this.user.token,
      commentId: comment.id,
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
        return
      }
      let rootId = comment.rootId
      const { comments } = this.state
      if (rootId) {
        for (let i = 0; i < comments.length; i++) {
          const o = comments[i]
          if (o.comment.id === rootId) {
            if (o.children) {
              for (let j = 0; j < o.children.length; j++) {
                const oo = o.children[j]
                if (oo.comment.id === comment.id) {
                  oo.comment.state = ECommentState.DELETED
                  this.setState({ comments })
                  break
                }
              }
            }
            break
          }
        }
      } else {
        for (let i = 0; i < comments.length; i++) {
          const o = comments[i]
          if (o.comment.id === comment.id) {
            o.comment.state = ECommentState.DELETED
            this.setState({ comments })
            break
          }
        }
      }
    })
  }

  toReport(id: string) {
    const { language } = this.props
    const opts: Array<IReportOptions> = [
      {
        id: 0,
        title: localWithKey(language, 'report-adv'),
      },
      {
        id: 1,
        title: localWithKey(language, 'report-politically'),
      },
    ]
    this.report.show({
      type: EReportType.COMMENT,
      objectId: id,
      title: localWithKey(language, 'report-comment'),
      defaultOptions: opts
    })
  }

  /**
   * 没有数据是渲染空的列表
   */
  private renderSofa() {
    return <Sofa language={this.props.language} />
  }

  /**
   * 渲染加载中
   */
  private renderLoading() {
    return <Loading />
  }

  renderNext(config: any, children: Array<ICommentChildModel>, language: ELanguageEnv, count: number) {
    if (!children || children.length === 0) return null
    const dom = children.map(e => {
      return (
        <div className="c-item c-clear" key={e.comment.id} style={{ borderTop: config.border }}>
          <Link to={`/u/${e.comment.userId}`}>
            <img
              className="c-a"
              src={getHashUrl(e.comment.avatar)}
              onMouseEnter={(evt) => this.showPreview(evt, e.comment.userId)}
              onMouseLeave={() => this.preview.hide()}
            />
          </Link>
          <div className="c-b">
            <div className="c-g">
              <div>
                <Link to={`/u/${e.comment.userId}`}>
                  <span
                    className="name"
                    style={{ color: config.color }}
                  >{e.comment.name}</span>
                </Link>
                <span className="a-reply">
                  {localWithKey(language, 'reply')}
                </span>
                <Link to={`/u/${e.parent.userId}`}>
                  <span
                    className="name"
                    style={{ color: config.color }}
                  >{e.parent.name}</span>
                </Link>
              </div>
              <Tooltip placement="bottom" title={`${localWithKey(language, 'created-at')} ${e.comment.createdAt}`}>
                <span className="a-ts">{dateDiff(e.comment.createdAt)}</span>
              </Tooltip>
            </div>
            <div
              className="c-c"
              style={
                e.comment.state === ECommentState.DELETED
                  ? { textDecoration: 'line-through' }
                  : undefined
              }
              dangerouslySetInnerHTML={{
                __html: e.comment.state === ECommentState.DELETED
                  ? localWithKey(language, 'comment-deleted')
                  : this.regexComment(e.comment.content, config)
              }}
            />
            {
              e.comment.state === ECommentState.NORMAL && e.comment.images.length ?
                (
                  <div className={`c-i-c ${config.content}`} style={{ width: 607 }}>
                    {
                      e.comment.images.map((elem, i) => <img className="c-i" key={i} src={getHashUrl(elem.image)} />)
                    }
                  </div>
                ) : null
            }
            <div className="c-i-t">
              <span className="c-i-item" onClick={() => this.toLike(e.comment)}>
                <i
                  className={`iconfont icon-dianzan icon ${e.comment.isLike ? 'rotate' : ''}`}
                  style={{ color: e.comment.isLike ? 'red' : '#8590a6' }}
                />
                {parseNumber(e.comment.likeCount)}
              </span>
              {
                e.comment.state === ECommentState.NORMAL
                  ? (<span className="c-i-item none" onClick={() => this.toReply(e.comment)}>
                    <i className="iconfont icon-icon_reply icon" />
                    {localWithKey(language, 'reply')}
                  </span>)
                  : null
              }
              {
                e.comment.state === ECommentState.NORMAL
                  ? (
                    <span className="c-i-item none" onClick={() => this.toReport(e.comment.id)}>
                      <i className="iconfont icon-icon_tip_off icon" />
                      {localWithKey(language, 'to-report')}
                    </span>
                  ) : null
              }
              {
                (this.user && this.user.id === e.comment.userId
                  && e.comment.state === ECommentState.NORMAL) ?
                  (
                    <span className="c-i-item none del" onClick={() => this.toDel(e.comment)}>
                      <i className="iconfont icon-shanchu icon" />
                      {localWithKey(language, 'to-delete')}
                    </span>
                  ) : null
              }
            </div>
          </div>
        </div>
      )
    })
    if (count > children.length) {
      return (
        <div>
          {dom}
          <span className="comment-link" onClick={() => this.loadNextComment(children, count - children.length)}>
            {`${localWithKey(language, 'load-limit')} ${count - children.length} ${localWithKey(language, 'comments')}`}
          </span>
        </div>
      )
    }
    return dom
  }

  private renderBody(config: any) {
    const { comments } = this.state
    if (!comments) return this.renderLoading()
    if (comments.length === 0) return this.renderSofa()
    return this.renderComment(config)
  }

  private renderItem(config: any, e: IListResponse, language: ELanguageEnv, hideBorder: boolean) {
    const { comment } = e
    return (
      <div className="c-item" key={comment.id} style={hideBorder ? undefined : { borderTop: config.border }}>
        <Link to={`/u/${comment.userId}`}>
          <img
            className="c-a"
            src={getHashUrl(comment.avatar)}
            onMouseEnter={e => this.showPreview(e, comment.userId)}
            onMouseLeave={() => this.preview.hide()}
          />
        </Link>
        <div className="c-b">
          <div className="c-g">
            <Link to={`/u/${comment.userId}`}>
              <span
                className="name"
                style={{ color: config.color }}
              >{comment.name}</span>
            </Link>

            <Tooltip placement="bottom" title={`${localWithKey(language, 'created-at')} ${comment.createdAt}`}>
              <span className="a-ts">{dateDiff(comment.createdAt)}</span>
            </Tooltip>
          </div>
          <div
            className="c-c"
            style={comment.state === ECommentState.DELETED
              ? { textDecoration: 'line-through' }
              : undefined}
            dangerouslySetInnerHTML={{
              __html: comment.state === ECommentState.DELETED
                ? localWithKey(language, 'comment-deleted')
                : this.regexComment(comment.content, config)
            }}
          />
          {
            comment.state === ECommentState.NORMAL && comment.images.length ?
              (
                <div className={`c-i-c ${config.content}`} style={{ width: 607 }}>
                  {
                    comment.images.map((e, i) => <img className="c-i" key={i} src={getHashUrl(e.image)} />)
                  }
                </div>
              ) : null
          }
          <div className="c-i-t">
            <span className="c-i-item" onClick={() => this.toLike(comment)}>
              <i
                className={`iconfont icon-dianzan icon ${comment.isLike ? 'rotate' : ''}`}
                style={{ color: comment.isLike ? 'red' : '#8590a6' }}
              />
              {parseNumber(comment.likeCount)}
            </span>
            {
              comment.state === ECommentState.NORMAL
                ? (<span className="c-i-item none" onClick={() => this.toReply(comment)}>
                  <i className="iconfont icon-icon_reply icon" />
                  {localWithKey(language, 'reply')}
                </span>)
                : null
            }
            {
              comment.state === ECommentState.NORMAL
                ? (<span className="c-i-item none" onClick={() => this.toReport(comment.id)}>
                  <i className="iconfont icon-icon_tip_off icon" />
                  {localWithKey(language, 'to-report')}
                </span>)
                : null
            }
            {
              (this.user && this.user.id === comment.userId
                && comment.state === ECommentState.NORMAL) ?
                (
                  <span className="c-i-item none del" onClick={() => this.toDel(comment)}>
                    <i className="iconfont icon-shanchu icon" />
                    {localWithKey(language, 'to-delete')}
                  </span>
                ) : null
            }
          </div>
          {this.renderNext(config, e.children, language, e.comment.childCount)}
        </div>
      </div>
    )
  }

  private renderComment(config: any) {
    const { comments, more, isLoading } = this.state
    const { language, mode } = this.props
    const commentDom = comments.map((e, i) => this.renderItem(config, e, language, i === 0))
    if (more) {
      return (
        <div>
          {commentDom}
          <div className="c-load-more">
            {
              isLoading
                ? (<Loading />)
                : (
                  <span
                    className={mode === ESystemTheme.night ? 'comment-link-night' : 'comment-link'}
                    onClick={() => this.findComment()}>
                    {localWithKey(language, 'load-more')}
                  </span>)
            }
          </div>
        </div>
      )
    }
    return commentDom
  }

  renderHeader(config: any, language: ELanguageEnv) {
    return (
      <div className="c-header" style={{ borderBottom: config.border }}>
        <span className="c-title">
          {`${this.commentCount} ${localWithKey(language, 'comments')}`}
        </span>
        <span
          className="c-reset"
          onClick={() => this.resetDidClick()}
          title={localWithKey(language, 'reset-title')}
        >
          {localWithKey(language, 'reset')}
        </span>
        <i
          className="iconfont icon-guanbi c-close"
          onClick={() => this.hide()}
        />
      </div>
    )
  }

  renderFooter(config: any) {
    const { mode, language } = this.props
    const { textAreaHeight, value, placeholder } = this.state
    return (
      <div className="c-footer" style={{ borderTop: config.border }}>
        <div className="c-f-c" style={{ border: config.border, height: textAreaHeight + 16 }}>
          <textarea
            placeholder={placeholder}
            id="c-i"
            rows={1}
            value={value}
            className={`c-f-i ${config.content}`}
            style={{ height: textAreaHeight }}
            onChange={(e) => {
              this.setState({ value: e.target.value })
              this.reseize()
            }}
            onCut={() => this.reseize()}
            onPaste={() => this.reseize()}
            onDrop={() => this.reseize()}
          />
          <Popover
            placement="top"
            content={
              <EmojiTab
                mode={mode}
                itemPress={title => this.emojiDidTap(title)}
              />
            }
            title={null}
            trigger="click"
          >
            <i className="iconfont icon-biaoqing icon" />
          </Popover>
          <i
            className="iconfont icon-ai-camera icon"
            onClick={() => {
              const { images } = this.state
              if (images.length >= 5) {
                showTips(localWithKey(language, 'upload-max-5'))
              } else {
                $('#picker').click()
              }
            }}
          />
        </div>
        <span className="c-f-s" onClick={() => this.publishDidClick()}>
          {localWithKey(language, 'publish')}
        </span>
      </div>
    )
  }

  renderImage() {
    const { textAreaHeight, images } = this.state
    if (images.length === 0) return null
    return (
      <div className="c-image" style={{ bottom: textAreaHeight + 81 }}>
        {
          images.map((e, i) => {
            return (
              <div key={i} className="c-image-item">
                <img src={getHashUrl(e.image)} />
                <i
                  className="iconfont icon-guanbi c-close-icon"
                  onClick={() => {
                    images.splice(i, 1)
                    this.setState({ images })
                  }}
                />
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    const { visible, textAreaHeight } = this.state
    if (!visible) return null
    const clientHeihgt = document.documentElement.clientHeight
    const modalHeight = clientHeihgt - 80
    const width = 690
    const config = this.getConfig()
    const { language, mode, fontFamily } = this.props
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
          {this.renderHeader(config, language)}
          <div
            className={`c-body ${config.content}`}
            style={{ height: modalHeight - 41 - 1 - textAreaHeight - 16 - 24 }}
          >
            {this.renderBody(config)}
          </div>
          {this.renderFooter(config)}
          {this.renderImage()}
          <input
            id="picker"
            type="file"
            className="pick-file"
            accept="image/*"
            onChange={(e) => this.toPickerFile(e)}
          />
          <PicEditor
            ref={(e) => { this.editor = e }}
            mode={mode}
            fontFamily={fontFamily}
            language={language}
          />
          <PersonPreview
            ref={e => this.preview = e}
            mode={mode}
            language={language}
            fontFamily={fontFamily}
          />
          <Confirm
            ref={(e) => { this.confirm = e }}
            mode={mode}
            fontFamily={fontFamily}
          />
          <Report
            ref={e => this.report = e}
            mode={mode}
            language={language}
            fontFamily={fontFamily}
          />
        </div>
      </Modal>
    )
  }
}
