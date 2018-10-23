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

export interface IAnswerDetailProps {
  match?: match
  fontFamily: EFontFamily
  fontColor: EFontColor
  language: ELanguageEnv
  mode: ESystemTheme
}

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

class AnswerDetail extends React.Component<IAnswerDetailProps> {
  private questionId: string
  private answerId: string

  constructor(props: IAnswerDetailProps) {
    super(props)
    const params: any = props.match.params
    this.questionId = params.qid
    this.answerId = params.aid
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps: IAnswerDetailProps) {
    const { mode } = this.props
    if (nextProps.mode !== mode) {
      this.configUI(nextProps.mode)
    }
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
      }
    } else {
      res = {
        bj: '#F6F6F6',
        block: '#FFFFFF',
        border: '1px solid #F0F0F0',
        color: '#333333',
        pre: '#F1F1F1',
        blockquote: '#d0e5f2',
      }
    }
    return res
  }

  renderOtherAnswer(config: any) {
    return (
      <Link to={`/q/${111}`}>
        <div
          className="shadow other-answer"
          style={{ background: config.block }}
        >查看其他 40 个回答</div>
      </Link>
    )
  }

  renderTargetAnswer(config: any) {
    return (
      <div className="shadow a-a" style={{ background: config.block }}>
        <div className="a-top">
          <Link to={`/u/${"2"}`}>
            <img className="a-avatar" src="https://pic3.zhimg.com/2b8be8010409012e7cdd764e1befc4d1_l.jpg" />
          </Link>
          <div className="a-info">
            <Link className="a-name" to={`/u/${"2"}`} style={{ color: config.color }}>
              啦啦
            </Link>
            <span className="a-intro">啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦</span>
          </div>
        </div>
        <div id="rich-body" className="w-e-text" dangerouslySetInnerHTML={{ __html: `<p>111111</p>` }}/>
        <div className="a-f">
          <span className="a-f-base a-f-b a-f-to-day">
            <i className="iconfont icon-sanjiaojiantoushang icon" />
            已赞同 1.96k
          </span>
          <span className="a-f-base">
            <i className="iconfont icon-comment icon" />
            1.96k 评论
          </span>
          <span className="a-f-base">
            <i className="iconfont icon-comment icon" />
            1.96k 评论
          </span>
        </div>
      </div>
    )
  }

  renderBody(config: any) {
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
        </Col>
        <Col span={7} style={styles.clear}>col-4</Col>
      </Row>
    )
  }

  render() {
    const config = this.getConfig()
    const { mode, fontFamily } = this.props
    return (
      <div id="answer" style={{ background: config.bj, fontFamily: getFontFamily(fontFamily) }}>
        <QuestionBar
          mode={mode}
          fontFamily={fontFamily}
          questionId={this.questionId}
        />
        {this.renderBody(config)}
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
