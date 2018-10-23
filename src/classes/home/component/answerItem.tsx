import * as React from 'react'
import { Link } from 'react-router-dom'
import { ELanguageEnv, ESystemTheme } from '../../../reducer/main'
import { IAnswerListUserModel, IAnswerListAnswerModel } from '../../../http/home'
import { getHashUrl } from '../../../utils/http'
import localWithKey from '../../../language'
import { parseNumber } from '../../../utils/utils'

export interface IAnswerItemProps {
  language?: ELanguageEnv
  mode?: ESystemTheme
  user: IAnswerListUserModel
  answer: IAnswerListAnswerModel
  config: any
}

export default class AnswerItem extends React.Component<IAnswerItemProps> {
  render() {
    const { language, mode, user, answer, config } = this.props
    return (
      <div className="shadow a-a" style={{ background: config.block }}>
        <div className="a-top">
          <Link to={`/u/${user.id}`}>
            <img className="a-avatar" src={getHashUrl(user.avatar)} />
          </Link>
          <div className="a-info">
            <Link className="a-name" to={`/u/${user.id}`} style={{ color: config.color }}>
              {user.name}
            </Link>
            <span className="a-intro">{user.whatIsUp}</span>
          </div>
        </div>
        <div
          id="rich-body"
          className="w-e-text"
          dangerouslySetInnerHTML={{ __html: answer.content }}
          style={{ color: config.color }}
        />
        <div className="a-f">
          <span className={`a-f-base a-f-b ${
            answer.isFollow
              ? (mode === ESystemTheme.night ? 'a-f-un-night' : 'a-f-un-day')
              : (mode === ESystemTheme.night ? 'a-f-to-night' : 'a-f-to-day')}`}>
            <i className="iconfont icon-sanjiaojiantoushang icon" />
            {`${localWithKey(language, answer.isFollow ? 'followed' : 'followto')} ${parseNumber(answer.followCount)}`}
          </span>
          <span className="a-f-base">
            <i className="iconfont icon-comment icon" />
            {`${parseNumber(answer.commentCount)} ${localWithKey(language, 'comment-count')}`}
          </span>
          <span className="a-f-base">
            <i
              className="iconfont icon-star icon i"
              style={{ color: answer.isCollect ? '#fccc35' : '#8590a6' }}
            />
            {`${parseNumber(answer.collectCount)} ${localWithKey(language, 'to-collect')}`}
          </span>
        </div>
      </div>
    )
  }
}
