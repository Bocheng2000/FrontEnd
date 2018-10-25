import * as React from 'react'
import { Link } from 'react-router-dom'
import { IAnswerListUserModel } from '../../../http/home'
import { ELanguageEnv } from '../../../reducer/main'
import localWithKey from '../../../language'
import { getHashUrl } from '../../../utils/http';
import user from '../../../reducer/user';
import { parseNumber } from '../../../utils/utils';

export interface IAboutAuthProps {
  user?: IAnswerListUserModel
  language?: ELanguageEnv
  config?: any
  followHandler?: () => void
  messageHandler?: () => void
}

export default class AboutAuth extends React.Component<IAboutAuthProps> {
  render() {
    const { config, language, user, followHandler, messageHandler } = this.props
    return (
      <div
        id="a-u"
        className="a-u-m"
        style={{ background: config.block }}>
        <div className="a-u-t" style={{ borderBottom: config.border }}>
          {localWithKey(language, 'about-user')}
        </div>
        <img
          className="a-u-c"
          src={getHashUrl(user.cover)}
        />
        <div className="a-u-i" style={{ borderBottom: config.border }}>
          <img
            className="a-u-a"
            style={{
              border: `3px solid ${config.block}`,
              borderBottom: 'none',
            }}
            src={getHashUrl(user.avatar)}
          />
          <div className="a-u-g">
            <div className="a-u-n" style={{ color: config.color }}>{user.name}</div>
            <div className="a-u-w" style={{ color: config.color }}>{user.whatIsUp}</div>
          </div>
        </div>
        <ul className="a-u-s">
          <Link to={`/u/${user.id}?h=a`}>
            <li className="a-u-info">
              <span className="a-u-title">{localWithKey(language, 'answer-count')}</span>
              <span className="a-u-count" style={{ color: config.color }}>
                {parseNumber(user.answerCount)}
              </span>
            </li>
          </Link>
          <Link to={`/u/${user.id}?h=p`}>
            <li className="a-u-info">
              <span className="a-u-title">{localWithKey(language, 'post-count')}</span>
              <span className="a-u-count" style={{ color: config.color }}>
                {parseNumber(user.postCount)}
              </span>
            </li>
          </Link>
          <Link to={`/u/${user.id}?h=f`}>
            <li className="a-u-info">
              <span className="a-u-title">{localWithKey(language, 'follower-count')}</span>
              <span className="a-u-count" style={{ color: config.color }}>
                {parseNumber(user.followerCount)}
              </span>
            </li>
          </Link>
        </ul>
        <div className="a-u-s">
          <span
            className={`q-b ${user.isFollow ? config.btn : 'q-button'}`}
            onClick={followHandler}
          >
            <i className={`iconfont ${user.isFollow ? 'icon-jian' : 'icon-jia'} q-icon`} />
            {localWithKey(language, user.isFollow ? 'unfollow' : 'follow-ta')}
          </span>
          <span
            className={`q-b ${config.btn}`}
            onClick={messageHandler}
          >
            <i className="iconfont icon-xiaoxi q-icon" />
            {localWithKey(language, 'message')}
          </span>
        </div>
      </div>
    )
  }
}
