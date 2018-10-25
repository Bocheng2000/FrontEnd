import * as React from 'react'
import { match, Link } from 'react-router-dom'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import { connect } from 'react-redux'
import { IStoreState } from '../../reducer'
import { EFontColor, EFontFamily, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import { getFontFamily } from '../../utils/font'
import QuestionBar from './component/questionBar'
import { animate_delay } from '../../utils/config'
import { answerList, IAnswerListResponse } from '../../http/home'
import { showTips } from '../../utils/tips'
import * as instance from '../../utils/instance'
import { ILoginResponse } from '../../http/user'
import localWithKey from '../../language';
import AnswerItem from './component/answerItem'
import AboutAuth from './component/aboutAuth'
import { createOrDel, EFollowType } from '../../http/follow'
import CommentModel from '../component/commentModal'

const styles = {
  clear: {
    margin: 0,
    padding: 0,
  },
  container: {
    margin: '0 auto',
    marginTop: 10,
  }
}

export interface IAnswerDetailProps {
  match?: match
  fontFamily: EFontFamily
  fontColor: EFontColor
  language: ELanguageEnv
  mode: ESystemTheme
}

interface IAnswerDetailState {
  info: IAnswerListResponse
}

class AnswerDetail extends React.Component<IAnswerDetailProps, IAnswerDetailState> {
  private questionId: string
  private answerId: string
  private timer: any
  private commentModal: CommentModel
  private isRequest: boolean = false

  constructor(props: IAnswerDetailProps) {
    super(props)
    const params: any = props.match.params
    this.questionId = params.qid
    this.answerId = params.aid
    this.state = {
      info: undefined
    }
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      let user = this.getUser()
      const params = {
        answerId: this.answerId,
        questionId: this.questionId,
        userId: user ? user.id : undefined,
        pageSize: 2,
        allAnswerCount: true
      }
      answerList(params, (err, data) => {
        if (err) {
          showTips(err)
          setTimeout(() => {
            instance.getValueByKey('history').replace(`/q/${this.questionId}`)
          }, 200)
        } else {
          this.setState({ info: data })
        }
      })
    }, animate_delay)
  }

  componentWillReceiveProps(nextProps: IAnswerDetailProps) {
    const { mode } = this.props
    if (nextProps.mode !== mode) {
      this.configUI(nextProps.mode)
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
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

  followObject(objectId: string, type: EFollowType, success: () => void) {
    if (this.isRequest) return
    const user = this.getUser()
    if (!user) {
      const { language } = this.props
      showTips(localWithKey(language, 'login-first'))
      return
    }
    this.isRequest = true
    createOrDel({
      id: user.id,
      token: user.token,
      objectId,
      type,
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
      } else {
        success()
      }
    })
  }

  followUserHandler() {
    const { info } = this.state
    const { answer } = info
    const { user } = answer
    this.followObject(user.id, EFollowType.USER, () => {
      this.setState({
        info: {
          ...info,
          answer: {
            ...answer,
            user: {
              ...user,
              isFollow: !user.isFollow,
              followerCount: user.isFollow ? user.followerCount - 1 : user.followerCount + 1,
            }
          }
        }
      })
    })
  }

  getConfig(mode?: ESystemTheme) {
    if (mode === undefined)
      mode = this.props.mode
    let res
    if (mode === ESystemTheme.night) {
      res = {
        bj: '#2F2F2F',
        block: '#3F3F3F',
        border: '1px solid #2F2F2F',
        color: '#c8c8c8',
        pre: '#2F2F2F',
        blockquote: '#1F1F1F',
        btn: 'q-button-un-night'
      }
    } else {
      res = {
        bj: '#F6F6F6',
        block: '#FFFFFF',
        border: '1px solid #F0F0F0',
        color: '#333333',
        pre: '#F1F1F1',
        blockquote: '#d0e5f2',
        btn: 'q-button-un-day'
      }
    }
    return res
  }

  messageHandler() {

  }

  getUser(): ILoginResponse {
    let me = instance.getValueByKey('info')
    if (me) 
      return me as ILoginResponse
    return undefined
  }

  renderOtherAnswer(config: any) {
    const { language } = this.props
    const { info: { answerCount } } = this.state
    if (answerCount === 0) {
      return null
    }
    return (
      <Link to={`/q/${this.questionId}`}>
        <div
          className="shadow other-answer"
          style={{ background: config.block }}
        >{`${localWithKey(language, 'view-other')} ${answerCount} ${localWithKey(language, 'answer-c')}`}</div>
      </Link>
    )
  }

  renderTargetAnswer(config: any) {
    const { mode, language } = this.props
    const { info: { answer: { user, answer } } } = this.state
    return (
      <AnswerItem
        mode={mode}
        language={language}
        answer={answer}
        user={user}
        config={config}
      />
    )
  }

  renderBody(config: any) {
    const { info } = this.state
    if (!info) {
      return null
    }
    const { answer: { user } } = info
    const { language } = this.props
    return (
      <Row
        gutter={24}
        type="flex"
        className="answer-body"
        justify="space-between"
        style={styles.container}
      >
        <Col id="answer-detail" span={16} style={styles.clear}>
          {this.renderOtherAnswer(config)}
          {this.renderTargetAnswer(config)}
          {this.renderOthers(config)}
        </Col>
        <Col span={7} style={styles.clear}>
          <AboutAuth
            user={user}
            language={language}
            config={config}
            followHandler={() => this.followUserHandler()}
            messageHandler={() => this.messageHandler()}
          />
        </Col>
      </Row>
    )
  }

  renderOthers(config: any) {
    const { info } = this.state
    if (!info) return null
    const { list } = info
    if (!list || list.length === 0) return null
    const { mode, language } = this.props
    return (
      <div>
        <div
          className="other-answer a-a-line"
          style={{ background: config.block }}
        >
          <span style={{ marginRight: 20, marginLeft: 30 }} />
          {localWithKey(language, 'more-answer')}
          <span style={{ marginLeft: 20, marginRight: 30 }} />
        </div>
        {list.map(({ answer, user }) => (
          <AnswerItem
            key={answer.id}
            mode={mode}
            language={language}
            answer={answer}
            user={user}
            config={config}
          />
        ))}
        {this.renderOtherAnswer(config)}
      </div>
    )
  }

  render() {
    const config = this.getConfig()
    const { mode, fontFamily, language } = this.props
    return (
      <div
        id="answer"
        style={{ background: config.bj, fontFamily: getFontFamily(fontFamily) }}
      >
        <QuestionBar
          mode={mode}
          fontFamily={fontFamily}
          questionId={this.questionId}
          commentHandler={(number) => this.commentModal.show({ objectId: this.questionId, commentCount: number })}
        />
        {this.renderBody(config)}
        <CommentModel ref={e => this.commentModal = e} mode={mode} language={language}/>
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

export default connect(mapStateToProps)(AnswerDetail)
