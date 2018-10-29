import * as React from 'react'
import { match, Link } from 'react-router-dom'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Affix from 'antd/lib/affix'
import { connect } from 'react-redux'
import { IStoreState } from '../../reducer'
import { EFontColor, EFontFamily, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import { getFontFamily } from '../../utils/font'
import QuestionBar from './component/questionBar'
import { animate_delay } from '../../utils/config'
import { answerList, IAnswerListResponse, IAnswerListAnswerModel } from '../../http/home'
import { showTips } from '../../utils/tips'
import * as instance from '../../utils/instance'
import { ILoginResponse } from '../../http/user'
import localWithKey from '../../language';
import AnswerItem from './component/answerItem'
import AboutAuth from './component/aboutAuth'
import { createOrDel, EFollowType } from '../../http/follow'
import { createOrDel as collectCreateOrDel, ECollectType } from '../../http/collect'
import CommentModel from '../component/commentModal'
import { ECommentType } from '../../http/comment'
import PersonPreview from '../component/PersonPreview'
import Report, { IReportOptions } from '../component/report'
import { EReportType } from '../../http/report'
import Relation from './component/relation'
import Sofa from '../component/sofa'

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

export interface IQuestionDetailProps {
  match?: match
  fontFamily: EFontFamily
  fontColor: EFontColor
  language: ELanguageEnv
  mode: ESystemTheme
}

interface IQuestionDetailState {
  info: IAnswerListResponse
}

class QuestionDetail extends React.Component<IQuestionDetailProps, IQuestionDetailState> {
  private questionId: string
  private timer: any
  private commentModal: CommentModel
  private isRequest: boolean = false
  private questionBar: QuestionBar
  private preview: PersonPreview
  private report: Report

  constructor(props: IQuestionDetailProps) {
    super(props)
    const params: any = props.match.params
    this.questionId = params.qid
    this.state = {
      info: undefined
    }
  }

  componentDidMount() {
    this.findQuestion()
  }

  componentWillReceiveProps(nextProps: IQuestionDetailProps) {
    const { mode } = this.props
    if (nextProps.mode !== mode) {
      this.configUI(nextProps.mode)
    }
    const params: any = nextProps.match.params
    const questionId = params.qid
    if (questionId !== this.questionId) {
      console.log('11111')
      this.questionId = questionId
      this.findQuestion()
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

  findQuestion() {
    this.timer = setTimeout(() => {
      let user = this.getUser()
      const params = {
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

  toFollowHandler(id: string, lvl: number) {
    this.followObject(id, EFollowType.POST, () => {
      const { info } = this.state
      if (lvl === 0) {
        if (info.answer.answer.isFollow) {
          info.answer.answer.followCount--
        } else {
          info.answer.answer.followCount++
        }
        info.answer.answer.isFollow = !info.answer.answer.isFollow
        this.setState({ info })
      } else {
        for (let i = 0; i < info.list.length; i++) {
          const o = info.list[i]
          if (o.answer.id === id) {
            if (o.answer.isFollow) {
              o.answer.followCount--
            } else {
              o.answer.followCount++
            }
            o.answer.isFollow = !o.answer.isFollow
            this.setState({ info })
            break
          }
        }
      }
    })
  }

  toCommentHandler(answer: IAnswerListAnswerModel, lvl: number) {
    this.commentModal.show({
      objectId: answer.id,
      commentCount: answer.commentCount,
      type: ECommentType.POST,
      submitCommentHandler: () => {
        const { info } = this.state
        if (lvl === 0) {
          info.answer.answer.commentCount++
          this.setState({ info })
        } else {
          for (let i = 0; i < info.list.length; i++) {
            const o = info.list[i]
            if (o.answer.id === answer.id) {
              o.answer.commentCount++
              this.setState({ info })
              break
            }
          }
        }
      }
    })
  }

  toCollectHandler(id: string, lvl: number) {
    if (this.isRequest) return
    const user = this.getUser()
    if (!user) {
      const { language } = this.props
      showTips(localWithKey(language, 'login-first'))
      return
    }
    this.isRequest = true
    collectCreateOrDel({
      id: user.id,
      token: user.token,
      objectId: id,
      type: ECollectType.POST,
    }, (err) => {
      this.isRequest = false
      if (err) {
        showTips(err)
      } else {
        const { info } = this.state
        if (lvl === 0) {
          if (info.answer.answer.isCollect) {
            info.answer.answer.collectCount--
          } else {
            info.answer.answer.collectCount++
          }
          info.answer.answer.isCollect = !info.answer.answer.isCollect
          this.setState({ info })
        } else {
          for (let i = 0; i < info.list.length; i++) {
            const o = info.list[i]
            if (o.answer.id === id) {
              if (o.answer.isCollect) {
                o.answer.collectCount--
              } else {
                o.answer.collectCount++
              }
              o.answer.isCollect = !o.answer.isCollect
              this.setState({ info })
              break
            }
          }
        }
      }
    })
  }

  toReport(id: string, type: EReportType) {
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
    let title
    switch (type) {
      case EReportType.POST:
        title = localWithKey(language, 'report-answer')
        break;
      default:
        title = localWithKey(language, 'report-question')
        break;
    }
    this.report.show({
      type: type,
      objectId: id,
      title,
      defaultOptions: opts
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

  showPersonPreview(evt: React.MouseEvent, userId: string) {
    const target = evt.target as HTMLElement
    this.preview.show({
      x: target.offsetLeft,
      y: target.offsetTop + 40,
      targetId: userId,
    })
  }

  renderBody(config: any) {
    const { info } = this.state
    if (!info) {
      return null
    }
    const { language, mode, fontFamily } = this.props
    return (
      <Row
        gutter={24}
        type="flex"
        className="answer-body"
        justify="space-between"
        style={styles.container}
      >
        <Col id="answer-detail" span={16} style={styles.clear}>
          {this.renderOthers(config)}
          <PersonPreview
            ref={e => this.preview = e}
            mode={mode}
            language={language}
            fontFamily={fontFamily}
          />
        </Col>
        <Col span={7} style={styles.clear}>
          <Affix offsetTop={66} >
            <Relation
              language={language}
              config={config}
              mode={mode}
              questionId={this.questionId}
            />
          </Affix>
        </Col>
      </Row>
    )
  }

  renderOthers(config: any) {
    const { info } = this.state
    if (!info) return null
    const { list } = info
    if (!list || list.length === 0) {
      return <Sofa language={this.props.language} />
    }
    const { mode, language } = this.props
    return (list.map(({ answer, user }) => (
      <AnswerItem
        key={answer.id}
        mode={mode}
        language={language}
        answer={answer}
        user={user}
        config={config}
        showPreview={(evt, userId) => this.showPersonPreview(evt, userId)}
        hidePreivew={() => this.preview.hide()}
        followHandler={() => this.toFollowHandler(answer.id, 1)}
        commentHandler={() => this.toCommentHandler(answer, 1)}
        collectHandler={() => this.toCollectHandler(answer.id, 1)}
        reportHandler={() => this.toReport(answer.id, EReportType.POST)}
      />
    )))
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
          ref={e => this.questionBar = e}
          mode={mode}
          fontFamily={fontFamily}
          questionId={this.questionId}
          commentHandler={(number) => {
            this.commentModal.show({
              objectId: this.questionId,
              commentCount: number,
              type: ECommentType.QUESTION,
              submitCommentHandler: () => {
                this.questionBar.plusCommentCount()
              }
            })
          }}
          reportHandler={() => this.toReport(this.questionId, EReportType.QUESTION)}
        />
        {this.renderBody(config)}
        <CommentModel
          ref={e => this.commentModal = e}
          mode={mode}
          language={language}
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

export default connect(mapStateToProps)(QuestionDetail)
