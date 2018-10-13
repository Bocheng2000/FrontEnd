import * as React from 'react'
import * as moment from 'moment'
import Tooltip from 'antd/lib/tooltip'
import { match, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { EFontFamily, EFontColor, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import { getFontFamily } from '../../utils/font'
import { IStoreState } from '../../reducer'
import * as instance from '../../utils/instance'
import localWithKey from '../../language'
import Empty, { EEmptyTypes } from '../component/empty'
import { postDetail, IPostDetailResponse, EPostDetailState } from '../../http/home'
import { ILoginResponse, detailPreview, IDetailPreviewResponse } from '../../http/user'
import Loading from '../component/loading'
import { animate_delay } from '../../utils/config'
import { getHashUrl } from '../../utils/http'
import { createOrDel, EFollowType } from '../../http/follow'
import { showTips } from '../../utils/tips'
import PersonPreview from '../component/PersonPreview'
import Report, { IReportOptions } from '../component/report'
import { EReportType } from '../../http/report'
import { parseNumber } from '../../utils/utils'
import Like from './component/like'

export interface IPostDetailProps {
  match?: match
  fontFamily: EFontFamily
  fontColor: EFontColor
  language: ELanguageEnv
  mode: ESystemTheme
}

interface IPostDetailState {
  detail: IPostDetailResponse
  preview: IDetailPreviewResponse
}

class PostDetail extends React.Component<IPostDetailProps, IPostDetailState> {
  private detailTimer: any
  private isRequest: boolean = false
  private preview: PersonPreview
  private report: Report
  constructor(props: IPostDetailProps) {
    super(props)
    this.state = {
      detail: undefined,
      preview: undefined
    }
  }

  componentDidMount() {
    this.getPostDetail()
  }


  componentWillReceiveProps(nextProps: IPostDetailProps) {
    const { mode } = this.props
    if (nextProps.mode !== mode) {
      this.configUI(nextProps.mode)
    }
  }

  componentWillUnmount() {
    this.detailTimer && clearTimeout(this.detailTimer)
  }

  configUI(mode?: ESystemTheme, fontFamily?: EFontFamily) {
    const config = this.getConfig(mode)
    if (fontFamily === undefined) {
      fontFamily = this.props.fontFamily
    }
    $('#post-detail .w-e-text').css({
      'color': config.color,
      'fontFamily': getFontFamily(fontFamily)
    })
    $('#post-detail .w-e-text code').css({
      'background-color': config.pre,
      'color': config.color
    })
    $('#post-detail .w-e-text blockquote').css({
      'background-color': config.pre,
      'border-left-color': config.blockquote,
      'color': config.color
    })
  }

  followOrNot() {
    const { language } = this.props
    const info = instance.getValueByKey('info')
    if (!info) {
      showTips(localWithKey(language, 'login-first'))
      return
    }
    if (this.isRequest) return
    this.isRequest = true
    const me = info as ILoginResponse
    const { detail } = this.state
    const { user } = detail
    createOrDel({
      id: me.id,
      token: me.token,
      objectId: user.id,
      type: EFollowType.USER,
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
      } else {
        this.setState({
          detail: {
            ...detail,
            user: {
              ...user,
              isFollow: !user.isFollow
            }
          }
        })
      }
    })
  }

  getPostDetail() {
    this.detailTimer && clearTimeout(this.detailTimer)
    this.detailTimer = setTimeout(() => {
      let userId
      const info = instance.getValueByKey('info')
      if (info) {
        userId = (info as ILoginResponse).id
      }
      const id = (this.props.match.params as any).id
      postDetail({ id, userId }, (err, data) => {
        if (err) {
          this.setState({ detail: null })
        } else {
          this.setState({ detail: data })
          setTimeout(() => {
            $(".lazy-load").lazyload({ effect: "fadeIn" })
            this.configUI()
          }, 50)
          this.getUserPreview(data.user.id)
        }
      })
    }, animate_delay)
  }

  getUserPreview(targetId: string) {
    let userId
    const info = instance.getValueByKey('info')
    if (info) {
      userId = (info as ILoginResponse).id
    }
    detailPreview({ userId, targetId }, (err, data) => {
      if (!err && data) {
        this.setState({ preview: data })
      }
    })
  }

  getConfig(mode?: ESystemTheme) {
    let res
    if (mode === undefined) {
      mode = this.props.mode
    }
    if (mode === ESystemTheme.day) {
      res = {
        border: '1px solid #E1E1E1',
        color: '#333333',
        tool: '#b4b4b4',
        pre: '#F1F1F1',
        blockquote: '#d0e5f2',
        bj: '#F0F0F0'
      }
    } else {
      res = {
        border: '1px solid #1F1F1F',
        color: '#c8c8c8',
        tool: '#969696',
        pre: '#2F2F2F',
        blockquote: '#1F1F1F',
        bj: '#2F2F2F'
      }
    }
    return res
  }

  likePost() {
    const { detail } = this.state
    const { post } = detail
    this.setState({
      detail: {
        ...detail,
        post: {
          ...post,
          isLike: !post.isLike,
          likeCount: post.isLike ? post.likeCount - 1 : post.likeCount + 1
        }
      }
    })
  }

  showPreview(evt: React.MouseEvent, userId: string) {
    var target = evt.target as HTMLElement
    this.preview.show({
      x: target.offsetLeft,
      y: target.offsetTop + 30,
      targetId: userId,
      handler: (isFollow) => {
        const { detail } = this.state
        const { user } = detail
        this.setState({
          detail: {
            ...detail,
            user: {
              ...user,
              isFollow,
            }
          }
        })
      }
    })
  }

  showReportModal() {
    const { language } = this.props
    const info = instance.getValueByKey('info')
    if (!info) {
      showTips(localWithKey(language, 'login-first'))
      return
    }
    const { detail: { post } } = this.state
    const opts: Array<IReportOptions> = [
      {
        id: 0,
        title: localWithKey(language, 'report-adv'),
      },
      {
        id: 1,
        title: localWithKey(language, 'report-unauthorized'),
      },
      {
        id: 2,
        title: localWithKey(language, 'report-politically'),
      },
    ]
    this.report.show({
      type: EReportType.POST,
      objectId: post.id,
      title: localWithKey(language, 'report-post'),
      defaultOptions: opts
    })
  }

  renderError(type: EEmptyTypes) {
    const { fontFamily, mode, language } = this.props
    return (
      <Empty
        fontFamily={fontFamily}
        mode={mode}
        language={language}
        type={type}
      />
    )
  }

  renderLoading() {
    return (
      <div className="base-body">
        <Loading />
      </div>
    )
  }

  renderCover() {
    const { detail } = this.state
    if (!detail.post.cover) {
      return null
    }
    return (
      <div className="cover-container">
        <img className="visible" src={getHashUrl(detail.post.cover)} />
        <img className="blur" src={getHashUrl(detail.post.cover)} />
      </div>
    )
  }

  renderTitle(config: any, detail: IPostDetailResponse) {
    return (
      <div
        className="post-detail-title"
        style={{ color: config.color }}
      >
        {detail.post.title}
      </div>
    )
  }

  renderAuthor(config: any) {
    const { detail: { post, user } } = this.state
    const { fontFamily, language } = this.props
    const link = `/u/${user.id}`
    return (
      <div
        className="post-detail-author"
        style={{ fontFamily: getFontFamily(fontFamily) }}
      >
        <Link to={link}>
          <img className="post-detail-avatar" src={getHashUrl(user.avatar)} />
        </Link>
        <div className="post-detail-info">
          <div className="post-detail-name">
            <Link
              className="post-detail-link"
              to={link}
              style={{ color: config.color }}
              onMouseEnter={(e) => this.showPreview(e, user.id)}
            >{user.name}</Link>
            <span
              className={`post-detail-btn ${user.isFollow ? 'post-detail-unfollow' : 'post-detail-follow'}`}
              onClick={() => this.followOrNot()}
            >
              <i className={`iconfont ${user.isFollow ? 'icon-jian' : 'icon-jia'} icon`} />
              {localWithKey(language, user.isFollow ? 'unfollow' : 'follow-ta')}
            </span>
          </div>
          <div className="post-detail-descript">
            <Tooltip
              placement="bottom"
              title={`${localWithKey(language, 'created-at')} ${post.createdAt}`}
            >
              <span>{moment(post.createdAt).format('YYYY.MM.DD HH:mm')}</span>
            </Tooltip>
            <span>{`${localWithKey(language, 'words')} ${parseNumber(post.wordsCount)}`}</span>
            <span>{`${localWithKey(language, 'read-count')} ${parseNumber(post.readCount)}`}</span>
            <span>{`${localWithKey(language, 'comment-count')} ${parseNumber(post.commentCount)}`}</span>
            <span>{`${localWithKey(language, 'like-count')} ${parseNumber(post.likeCount)}`}</span>
          </div>
        </div>
      </div>
    )
  }

  renderBody(detail: IPostDetailResponse) {
    return (
      <div
        id="rich-body"
        className="w-e-text"
        dangerouslySetInnerHTML={{ __html: detail.post.content }}
      />
    )
  }

  renderSpecial(config: any) {
    const { detail } = this.state
    const { special: { id, title, avatar } } = detail
    const { language, fontFamily } = this.props
    return (
      <div
        className="post-detail-footer"
        style={{ color: config.color, fontFamily: getFontFamily(fontFamily) }}
      >
        <Link to={`/t/${id}`} className="post-detail-special">
          <img
            className="post-detail-special-avatar"
            src={getHashUrl(avatar)}
          />
          <span
            className="post-detail-special-title"
            style={{ color: config.color }}
          >{title}</span>
        </Link>
        <div className="post-detail-tool">
          <span
            className="post-detail-report"
            onClick={() => this.showReportModal()}
          >
            {localWithKey(language, 'report-post')}
          </span>
          <span>
            © {localWithKey(language, 'copyright-author')}
          </span>
        </div>
      </div>
    )
  }

  renderUserPreivew(config: any) {
    const { fontFamily, language } = this.props
    let { preview, detail: { user } } = this.state
    if (preview === undefined) {
      preview = {
        avatar: '',
        followerCount: 0,
        id: user.id,
        isFollow: user.isFollow,
        likeCount: 0,
        name: user.name,
        whatIsUp: '',
        wordsCount: 0
      }
    }
    return (
      <div
        className="post-detail-user"
        style={{
          fontFamily: getFontFamily(fontFamily),
          background: config.bj,
          border: config.border,
        }}
      >
        <div className="post-detail-user-top">
          <Link to={`/u/${user.id}`}>
            <img
              className="post-detail-user-avatar"
              src={getHashUrl(user.avatar)}
            />
          </Link>
          <div className="post-detail-user-info">
            <Link
              to={`/u/${user.id}`}
              className="post-detail-user-name"
              style={{ color: config.color }}
              onMouseEnter={e => this.showPreview(e, user.id)}
            >{user.name}</Link>
            <div className="post-detail-descript">
              <span>
                {`${localWithKey(language, 'has-write')}${parseNumber(preview.wordsCount)}${localWithKey(language, 'word')}`}
              </span>
              <span>
                {`${localWithKey(language, 'been')}${parseNumber(preview.followerCount)}${localWithKey(language, 'to-follow')}`}
              </span>
              <span>
                {`${localWithKey(language, 'get')}${parseNumber(preview.likeCount)}${localWithKey(language, 'likes')}`}
              </span>
            </div>
          </div>
          <span
            className={`post-detail-btn ${user.isFollow ? 'post-detail-unfollow' : 'post-detail-follow'}`}
            onClick={() => this.followOrNot()}
          >
            <i className={`iconfont ${user.isFollow ? 'icon-jian' : 'icon-jia'} icon`} />
            {localWithKey(language, user.isFollow ? 'unfollow' : 'follow-ta')}
          </span>
        </div>
        {
          preview.whatIsUp
            ? (<div
                className="post-detail-user-what"
                style={{ borderTop: config.border }}
              >{preview.whatIsUp}</div>)
            : null
        }
      </div>
    )
  }

  renderLikeAndShare(config: any) {
    const { detail: { post } } = this.state
    return (
      <div className="post-detail-opt">
        <Like
          isLike={post.isLike}
          likeCount={post.likeCount}
          handler={() => this.likePost()}
        />
      </div>
    )
  }

  render() {
    const { detail } = this.state
    if (detail === undefined) {
      return this.renderLoading()
    } else if (detail === null) {
      return this.renderError(EEmptyTypes.NORMAL)
    } else if (detail.post.state === EPostDetailState.DELETED) {
      return this.renderError(EEmptyTypes.DELETE)
    }
    const config = this.getConfig()
    const { mode, language, fontFamily } = this.props
    return (
      <div id="post-detail" className="base-body">
        {this.renderCover()}
        {this.renderTitle(config, detail)}
        {this.renderAuthor(config)}
        {this.renderBody(detail)}
        {this.renderSpecial(config)}
        {this.renderUserPreivew(config)}
        {this.renderLikeAndShare(config)}
        <PersonPreview
          ref={e => this.preview = e}
          mode={mode}
          language={language}
          fontFamily={fontFamily}
        />
        <Report
          ref={e => this.report = e}
          mode={mode}
          language={language}
          fontFamily={fontFamily}
        />
      </div>
    )
  }
}

function mapStateToProps({
  main: { system: { fontFamily, fontColor, language, mode } },
}: IStoreState) {
  return {
    fontFamily,
    fontColor,
    language,
    mode,
  }
}

export default connect(mapStateToProps)(PostDetail)
