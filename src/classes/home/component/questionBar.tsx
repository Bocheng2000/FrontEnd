import * as React from 'react'
import { Link } from 'react-router-dom'
import { ESystemTheme, EFontFamily, ELanguageEnv } from '../../../reducer/main'
import { questionPreview, IQuestionPreviewResponse } from '../../../http/home'
import { animate_delay } from '../../../utils/config'
import * as instance from '../../../utils/instance'
import { ILoginResponse } from '../../../http/user'
import Loading from '../../component/loading'
import { showTips } from '../../../utils/tips'
import localWithKey from '../../../language';
import { parseNumber } from '../../../utils/utils'
import SpecialPreview from '../../component/specialPreview'

export interface IQuestionBarProps {
  mode?: ESystemTheme
  fontFamily?: EFontFamily
  language?: ELanguageEnv
  questionId: string
}

interface IQuestionBarState {
  question: IQuestionPreviewResponse
}

export default class QuestionBar extends React.Component<IQuestionBarProps, IQuestionBarState> {
  private timer: any
  private special: SpecialPreview
  constructor(props: IQuestionBarProps) {
    super(props)
    this.state = {
      question: undefined,
    }
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.findQuestionInfo()
    }, animate_delay)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  findQuestionInfo() {
    let userId
    let info = instance.getValueByKey('info')
    if (info) {
      userId = (info as ILoginResponse).id
    }
    const { questionId } = this.props
    questionPreview({
      userId,
      id: questionId,
    }, (err, data) => {
      if (err) {
        showTips(err)
        this.timer = setTimeout(() => {
          instance.getValueByKey('history').replace('/')
        }, 500)
      } else {
        this.setState({ question: err ? null : data })
      }
    })
  }


  getConfig() {
    const { mode } = this.props
    let res
    if (mode === ESystemTheme.night) {
      res = {
        block: '#3F3F3F',
        border: '1px solid #2F2F2F',
        color: '#c8c8c8',
        btn: 'q-button-un-night'
      }
    } else {
      res = {
        block: '#FFFFFF',
        border: '1px solid #F0F0F0',
        color: '#333333',
        btn: 'q-button-un-day'
      }
    }
    return res
  }

  showSpecialPreview(evt: React.MouseEvent, specialId: string) {
    var target = evt.target as HTMLElement
    this.special.show({
      x: target.offsetLeft,
      y: target.offsetTop + 50,
      targetId: specialId,
    })
  }

  render() {
    const { question } = this.state
    if (question === undefined) {
      return <Loading />
    }
    const config = this.getConfig()
    const { fontFamily, mode, language } = this.props
    return (
      <div
        className="q-nav"
        style={{
          background: config.block,
        }}>
        <div className="q-container">
          <div className="q-left">
            <div className="q-top">
              <Link to={`/t/${question.specialId}`}>
                <span
                  className="q-special"
                  onMouseEnter={e => this.showSpecialPreview(e, question.specialId)}
                  onMouseLeave={() => this.special.hide()}
                >{question.specialTitle}</span>
              </Link>
            </div>
            <div className="q-title" style={{ color: config.color }}>{question.title}</div>
            {
              question.introduction ?
                <div className="q-introduction" style={{ color: config.color }}>
                  {question.introduction}
                </div>
                : null
            }
            <div className="q-tool">
              <span className={`q-b ${question.isFollow ? config.btn : 'q-button'}`}>
                {localWithKey(language, question.isFollow ? 'unfollow-question' : 'follow-question')}
              </span>
              <span className={`q-b ${config.btn}`}>
                <i className="iconfont icon-bi q-icon" />
                {localWithKey(language, 'write-answer')}
              </span>
              <span className="q-item">
                <i className="iconfont icon-comment q-icon" />
                {`${parseNumber(question.commentCount)} ${localWithKey(language, 'comment-count')}`}
              </span>
              <span className="q-item">
                <i className="iconfont icon-tubiaozhizuo- q-icon" />
                {localWithKey(language, 'to-share')}
              </span>
              <span className="q-item">
                <i className="iconfont icon-star q-icon" />
                {localWithKey(language, 'invite-answer')}
              </span>
              <span className="q-item">
                <i className="iconfont icon-icon_tip_off q-icon" />
                {localWithKey(language, 'to-report')}
              </span>
            </div>
          </div>
          <div className="q-info">
            <div className="q-item" style={{ borderRight: config.border }}>
              <div className="q-tag">
                {localWithKey(language, 'follower-count')}
              </div>
              <div className="q-count" style={{ color: config.color }}>
                {parseNumber(question.followerCount)}
              </div>
            </div>
            <div className="q-item">
              <div className="q-tag">
                {localWithKey(language, 'be-visit')}
              </div>
              <div className="q-count" style={{ color: config.color }}>
                {parseNumber(question.visitCount)}
              </div>
            </div>
          </div>
        </div>
        <SpecialPreview
          ref={e => this.special = e}
          mode={mode}
          language={language}
          fontFamily={fontFamily}
        />
      </div>
    )
  }
}
