import * as React from 'react'
import { Link } from 'react-router-dom'
import { ELanguageEnv, ESystemTheme } from '../../../reducer/main'
import localWithKey from '../../../language'
import { animate_delay } from '../../../utils/config'
import { relation, IRelationReponse } from '../../../http/home'
import Loading from '../../component/loading'


export interface IRelationProps {
  language?: ELanguageEnv
  mode?: ESystemTheme
  config?: any
  questionId: string
}

export interface IRelationState {
  list: Array<IRelationReponse>
}

export default class Relation extends React.Component<IRelationProps, IRelationState> {
  private timer: any

  constructor(props: IRelationProps) {
    super(props)
    this.state = {
      list: undefined
    }
  }

  componentDidMount() {
    this.findRelation()
  }

  componentWillReceiveProps(nextProps: IRelationProps) {
    const { questionId } = this.props
    if (questionId !== nextProps.questionId) {
      this.findRelation()
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  findRelation() {
    this.setState({ list: undefined })
    this.timer = setTimeout(() => {
      const { questionId } = this.props
      relation({
        id: questionId,
        pageSize: 5,
      }, (err, data) => {
        if (err || data.length === 0) {
          this.setState({ list: null })
        } else {
          this.setState({ list: data })
        }
      })
    }, animate_delay)
  }

  renderLists() {
    const { list } = this.state
    if (list === undefined)
      return <Loading />
    const { language, mode } = this.props
    return (
      <div className="a-u-body">
        {
          list.map(e => (
            <div className="a-u-item" key={e.id}>
              <Link
                to={`/q/${e.id}`}
                className={mode === ESystemTheme.night ? 'a-u-link-night' : 'a-u-link-day'}
              >
                {e.title}
              </Link>
              {`${e.count} ${localWithKey(language, 'answer-count')}`}
            </div>
          ))
        }
      </div>
    )
  }

  render() {
    const { list } = this.state
    if (list === null)
      return null
    const { config, language } = this.props
    return (
      <div
        id="a-u"
        className="a-u-m"
        style={{ background: config.block }}>
        <div
          className="a-u-t"
          style={{ borderBottom: config.border, color: config.color }}
        >
          {localWithKey(language, 'relation-question')}
        </div>
        {this.renderLists()}
      </div>
    )
  }
}
