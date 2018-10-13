import * as React from 'react'

export interface ILikeProps {
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
    const target = document.getElementById('like')
    target.classList.toggle('liked')
    const { handler } = this.props
    handler && handler()
  }

  render() {
    const { likeCount, isLike } = this.props
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
        <div className="post-detail-like">
          <span>喜欢</span>
          <span>{likeCount}</span>
        </div>
      </div>
    )
  }
}
