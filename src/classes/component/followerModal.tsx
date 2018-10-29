import * as React from 'react'
import Modal from 'antd/lib/modal'
import { Link } from 'react-router-dom'
import { ESystemTheme, ELanguageEnv, EFontFamily } from '../../reducer/main'
import localWithKey from '../../language'
import { list, IListResponse } from '../../http/follow'
import Loading from './loading'
import Sofa from './sofa'
import { getHashUrl } from '../../utils/http'
import { parseNumber } from '../../utils/utils'
import * as instance from '../../utils/instance'
import { ILoginResponse } from '../../http/user'
import { page_size, animate_delay } from '../../utils/config'
import { showTips } from '../../utils/tips'
import { createOrDel, EFollowType } from '../../http/follow'
import PersonPreview from './PersonPreview'

export interface IFollowerModalProps {
  ref?: (e: FollowerModal) => void
  mode?: ESystemTheme
  language?: ELanguageEnv
  fontFamily?: EFontFamily
}

interface IFollowerModalState {
  visible: boolean
  isLoading: boolean
  more: boolean
  dataSource: Array<IListResponse>
}

export interface IFollowerModalParams {
  objectId: string
}

export default class FollowerModal extends React.Component<IFollowerModalProps, IFollowerModalState> {
  private isRequest: boolean = false
  private objectId: string
  private timer: any
  private user: ILoginResponse
  private preview: PersonPreview

  constructor(props: IFollowerModalProps) {
    super(props)
    this.state = {
      visible: false,
      isLoading: false,
      more: true,
      dataSource: undefined,
    }
    let user = instance.getValueByKey('info')
    if (user) this.user = user as ILoginResponse
  }

  public show(params: IFollowerModalParams) {
    this.objectId = params.objectId
    this.setState({
      visible: true,
      isLoading: false,
      more: true,
      dataSource: undefined
    })
    this.findFollowList()
  }

  followOrNot(index: number) {
    if (this.isRequest) return
    if (!this.user) {
      const { language } = this.props
      showTips(localWithKey(language, 'login-first'))
      return
    }
    this.isRequest = true
    const { dataSource } = this.state
    createOrDel({
      id: this.user.id,
      token: this.user.token,
      objectId: dataSource[index].id,
      type: EFollowType.USER,
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
      } else {
        const o = dataSource[index]
        if (o.isFollow)
          o.followerCount--
        else
          o.followerCount++
        o.isFollow = !o.isFollow
        this.setState({ dataSource })
      }
    })
  }

  findFollowList() {
    if (this.isRequest) return
    this.isRequest = true
    this.setState({ isLoading: true })
    this.timer = setTimeout(() => {
      let userId
      let user = instance.getValueByKey('info')
      if (user) userId = (user as ILoginResponse).id
      const { dataSource = [] } = this.state
      let maxId
      if (dataSource && dataSource.length) {
        maxId = dataSource[dataSource.length - 1].followId
      }
      list({
        id: this.objectId,
        userId,
        maxId,
        pageSize: page_size
      }, (err, data) => {
        this.isRequest = false
        if (err) {
          this.setState({ isLoading: false })
        } else {
          this.setState({
            isLoading: false,
            dataSource: dataSource.concat(data),
            more: data.length === page_size,
          })
        }
      })
    }, animate_delay)
  }

  private hide() {
    this.timer && clearTimeout(this.timer)
    this.setState({
      visible: false,
      isLoading: false,
      more: false,
      dataSource: undefined
    })
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

  showPreview(evt: React.MouseEvent, userId: string) {
    const target = evt.target as HTMLElement
    this.preview.show({
      x: target.offsetLeft,
      y: target.offsetTop + 60 - $('.f-body').scrollTop(),
      targetId: userId,
      handler: (isFollow) => {
        const { dataSource } = this.state
        for (let i = 0; i < dataSource.length; i++) {
          const o = dataSource[i]
          if (o.id === userId) {
            if (isFollow)
              o.followerCount ++
            else
              o.followerCount --
            o.isFollow = isFollow
            this.setState({ dataSource })
            break
          }
        }
      }
    })
  }

  renderHeader(config: any, language: ELanguageEnv) {
    return (
      <div className="f-header" style={{ borderBottom: config.border }}>
        <span className="f-title">
          dddd
        </span>
        <i
          className="iconfont icon-guanbi f-close"
          onClick={() => this.hide()}
        />
      </div>
    )
  }

  renderBody(config: any) {
    const { dataSource } = this.state
    if (dataSource === undefined) return null
    const { language, mode } = this.props
    if (dataSource === null) return <Sofa language={language} />
    return dataSource.map((e, i) => (
      <li className="f-item" key={e.id} style={{ borderBottom: config.border }}>
        <Link
          to={`/u/${e.id}`}
          onMouseEnter={(evt) => this.showPreview(evt, e.id)}
          onMouseLeave={() => this.preview.hide()}
        >
          <img className="f-avatar" src={getHashUrl(e.avatar)} />
        </Link>
        <div className="f-content">
          <Link to={`/u/${e.id}`} className="f-name" style={{ color: config.color }}>
            {e.name}
          </Link>
          <div className="f-desc">
            {`${parseNumber(e.answerCount)} ${localWithKey(language, 'answer-count')} · ${parseNumber(e.followerCount)} ${localWithKey(language, 'follower-count')}`}
          </div>
        </div>
        {
          (!this.user || this.user.id !== e.id)
            ? (<span
              className={`btn ${e.isFollow ? mode === ESystemTheme.night ? 'q-button-un-night' : 'q-button-un-day' : 'follow'}`}
              onClick={() => this.followOrNot(i)}
            >
              <i className={`iconfont ${e.isFollow ? 'icon-jian' : 'icon-jia'} icon`} />
              {localWithKey(language, e.isFollow ? 'unfollow' : 'follow-ta')}
            </span>) : null
        }
      </li>
    ))
  }

  renderLoadMore() {
    const { isLoading, more } = this.state
    if (!more) return null
    const { language, mode } = this.props
    return (
      <div className="c-load-more">
        {
          isLoading
            ? (<Loading />)
            : (
              <span
                className={mode === ESystemTheme.night ? 'comment-link-night' : 'comment-link'}
                onClick={() => this.findFollowList()}
              >
                {localWithKey(language, 'load-more')}
              </span>)
        }
      </div>
    )
  }

  render() {
    const { visible } = this.state
    if (!visible) return null
    const config = this.getConfig()
    const clientHeihgt = document.documentElement.clientHeight
    const modalHeight = clientHeihgt - 80
    const width = 690
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
        width={690}
      >
        <div
          id="follower-modal"
          className={config.content}
          style={{ height: modalHeight, width: width - 1, color: config.color }}
        >
          {this.renderHeader(config, language)}
          <ul
            className={`f-body ${config.content}`}
            style={{ height: modalHeight - 41 - 1 }}
          >
            {this.renderBody(config)}
            {this.renderLoadMore()}
          </ul>
          <PersonPreview
            ref={e => this.preview = e}
            mode={mode}
            language={language}
            fontFamily={fontFamily}
          />
        </div>
      </Modal>
    )
  }
}
