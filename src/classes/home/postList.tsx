import * as React from 'react'
import { EFontFamily, ESystemTheme, ELanguageEnv } from '../../reducer/main'
import { getFontFamily } from '../../utils/font'
import { IFindListResponse, findList } from '../../http/home'
import { animate_delay, page_size } from '../../utils/config'
import { Link } from 'react-router-dom'
import { getHashUrl } from '../../utils/http'
import * as instance from '../../utils/instance'
import { ILoginResponse } from '../../http/user'
import { showTips } from '../../utils/tips'
import PostLoading from './component/postLoading'
import { clipText, parseNumber } from '../../utils/utils'
import Loading from '../component/loading'
import localWithKey from '../../language'
import PersonPreview from '../component/PersonPreview'

export interface IPostListProps {
  fontFamily: EFontFamily
  mode: ESystemTheme
  language: ELanguageEnv
}

interface IPostListState {
  isLoading: boolean
  more: boolean
  dataSource?: Array<IFindListResponse>
}

export default class PostList extends React.Component<IPostListProps, IPostListState> {
  private isLoading: boolean = false
  private timer: any = undefined
  private preview: PersonPreview
  constructor(props: IPostListProps) {
    super(props)
    this.state = {
      isLoading: false,
      more: true,
      dataSource: undefined
    }
  }

  componentDidMount() {
    this.loadNetData()
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  getConfig() {
    let res
    const { mode } = this.props
    if (mode === ESystemTheme.day) {
      res = {
        border: '1px solid #F0F0F0',
        color: '#333333',
        tool: '#b4b4b4',
      }
    } else {
      res = {
        border: '1px solid #2F2F2F',
        color: '#c8c8c8',
        tool: '#969696',
      }
    }
    return res
  }

  /**
   * 获取请求参数
   */
  getRequestParms() {
    let userId: string = undefined
    let user = instance.getValueByKey('info')
    if (user) {
      userId = (user as ILoginResponse).id
    }
    const { dataSource } = this.state
    let maxId: string = undefined
    if (dataSource) {
      const lastOne = dataSource[dataSource.length - 1]
      maxId = lastOne.id
    }
    return {
      userId,
      maxId,
    }
  }

  /**
   * 请求数据
   */
  loadNetData() {
    if (this.isLoading) return
    this.isLoading = true
    this.setState({ isLoading: true })
    this.timer = setTimeout(() => {
      const req = this.getRequestParms()
      findList({
        userId: req.userId,
        maxId: req.maxId,
        pageSize: page_size
      }, (err, data) => {
        this.isLoading = false
        if (err) {
          showTips(err)
        } else if (!req.maxId && data.length === 0) {
          this.setState({
            isLoading: false,
            more: false,
            dataSource: null
          })
        } else {
          this.setState({
            isLoading: false,
            more: data.length === page_size,
            dataSource: (this.state.dataSource || []).concat(data)
          })
        }
      })
    }, animate_delay)
  }

  mouseEnter(evt: React.MouseEvent, e: IFindListResponse) {
    var target = evt.target as HTMLElement
    this.preview.show({
      x: target.offsetLeft,
      y: target.offsetTop + 30,
      targetId: e.userId
    })
  }

  mouseLeave() {
    this.preview.hide()
  }

  renderItems(config: any, e: IFindListResponse) {
    let to
    if (e.questionId) {
      to = `/q/${e.questionId}/${e.id}`
    } else {
      to = `/p/${e.id}`
    }
    return (
      <li
        className="item"
        style={{ borderTop: config.border }}
        key={e.id}
      >
        <div className="content">
          <Link
            to={to}
            className="title"
            style={{ color: config.color, borderBottomColor: config.color }}
          >{e.title}</Link>
          <div className="message">
            {clipText(e.content)}
          </div>
          <div className="footer" style={{ color: config.tool }}>
            <span
              className="footer-item pointer"
              onMouseEnter={(evt) => this.mouseEnter(evt, e)}
              onMouseLeave={() => this.mouseLeave()}
            >
              <img src={getHashUrl(e.avatar)} className="avatar" />
              {e.userName}
            </span>
            <span className="footer-item">
              <i className="iconfont icon-pinglun2 icon" />
              {parseNumber(e.commentCount)}
            </span>
            <span className="footer-item">
              <i className="iconfont icon-xihuan1 icon" />
              {parseNumber(e.followCount)}
            </span>
            <span className="footer-item">
              <i className="iconfont icon-shoucang icon" />
              {parseNumber(e.collectCount)}
            </span>
          </div>
        </div>
        {
          e.cover ?
            (
              <Link to={to}>
                <div
                  className="cover"
                  style={{
                    backgroundImage: `url(${getHashUrl(e.cover)})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}
                />
              </Link>
            )
            : null
        }
      </li>
    )
  }

  renderLoading(mode: ESystemTheme) {
    return (
      <div style={{ marginBottom: '20px' }} >
        <PostLoading mode={mode} />
        <PostLoading mode={mode} />
        <PostLoading mode={mode} />
        <PostLoading mode={mode} />
      </div>
    )
  }

  renderEmpty() {
    
  }

  renderLoadMore(isLoading: boolean, more: boolean) {
    if (!more) {
      return null
    }
    if (isLoading) {
      return <Loading />
    }
    const { language } = this.props
    return (
      <div
        className="load-more"
        onClick={() => this.loadNetData()}
      >{localWithKey(language, "load-more")}</div>
    )
  }

  render() {
    const { isLoading, more, dataSource } = this.state
    const { fontFamily, mode, language } = this.props
    if (dataSource === undefined) {
      return this.renderLoading(mode)
    } else if (dataSource === null) {

    }
    const config = this.getConfig()
    return (
      <ul
        id="post-list"
        style={{ fontFamily: getFontFamily(fontFamily) }}
      >
        {dataSource.map(e => this.renderItems(config, e))}
        {this.renderLoadMore(isLoading, more)}
        <PersonPreview
          ref={e => this.preview = e}
          mode={mode}
          language={language}
          fontFamily={fontFamily}
        />
      </ul>
    )
  }
}
