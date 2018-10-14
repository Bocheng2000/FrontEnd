import * as React from 'react'
import { ELanguageEnv, EFontFamily } from '../../../reducer/main'
import { getFontFamily } from '../../../utils/font';
import localWithKey from '../../../language';

export interface ILikeProps {
  fontFamily?: EFontFamily
  language?: ELanguageEnv
  canLike: boolean
  isLike: boolean
  likeCount: number
  handler?: () => void
}

export default class Like extends React.Component<ILikeProps> {

  componentDidMount() {
    const { isLike } = this.props
    if (isLike) {
      const target = document.getElementById('like')
      target.classList.toggle('liked')
    }
  }

  likeDidClick() {
    const { handler, canLike } = this.props
    if (canLike) {
      const target = document.getElementById('like')
      target.classList.toggle('liked')
    }
    handler && handler()
  }

  render() {
    const { likeCount, isLike, fontFamily, language } = this.props
    return (
      <div
        id="like-fix"
        onClick={() => this.likeDidClick()}
      >
        <div id="like">
          <svg
            height="160"
            width="160"
            className="like"
          >
            <path className="path" d="M 80 72.5 c 7.5 -45 85 -10 0 45 m 0 -45 c -7.5 -45 -85 -10 0 45" fill="white"></path>
          </svg>
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
          <div className="dot dot-5"></div>
          <div className="dot dot-6"></div>
          <div className="dot dot-7"></div>
          <div className="dot dot-8"></div>
        </div>
        <div
          className="post-detail-like"
          style={{
            fontFamily: getFontFamily(fontFamily),
            background: isLike ? 'rgba(232,112,94,0.1)' : 'transparent',
          }}
        >
          <span>{localWithKey(language, 'like')}</span>
          <span>{likeCount}</span>
        </div>
      </div>
    )
  }
}
