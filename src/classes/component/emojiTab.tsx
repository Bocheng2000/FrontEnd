import * as React from 'react'
import * as $ from 'jquery'
import { ESystemTheme } from '../../reducer/main'
import { getHashUrl } from '../../utils/http'

export interface IEmojiTabProps {
  mode?: ESystemTheme
  itemPress?: (title: string) => void
}

export default class EmojiTab extends React.Component<IEmojiTabProps> {
  
  componentDidMount() {
    this.addListener()
  }

  getConfig() {
    const { mode } = this.props
    if (mode === ESystemTheme.night) {
      return {
        bj: '#2F2F2F',
        dotBj: '#202020',
        class: 'dot-night'
      }
    }
    return {
      bj: '#FFFFFF',
      dotBj: '#EEEEEE',
      class: 'dot-day'
    }
  }

  addListener() {
    $('#emoji .dot-base').on('click', function() {
      if ($(this).hasClass('dot-active')) return
      const idx = $('#emoji .dot-base').index(this)
      $(this).addClass('dot-active').siblings().removeClass('dot-active')
      $('#emoji .emoji-mask').css('left', `-${idx * 300}px`)
    })
    const { itemPress } = this.props
    if (itemPress) {
      $('#emoji .emoji-mask img').on('click', function() {
        const title = $(this).attr('title')
        itemPress(`[:${title}:]`)
      })
    }
  }

  renderItems() {
    const json = require('../../file/emoji.json')
    const dom: Array<any> = []
    const group: { [key: string]: Array<any> } = {}
    for (let y = 0; y < json.length; y++) {
      let m = Math.floor(y / 50)
      const e = json[y]
      if (group[m] === undefined) {
        group[m] = []
      }
      group[m].push(<img key={y} src={getHashUrl(e.src)} title={e.title} />)
    }
    Object.keys(group).forEach((e, i) => {
      dom.push(
        <li key={`d-${i}`} className="tab">{group[e]}</li>
      )
    })
    return dom
  }

  render() {
    const config = this.getConfig()
    return (
      <div id="emoji">
        <div className="emoji-container" style={{ background: config.bj }}>
          <ul className="emoji-mask">
            {this.renderItems()}
          </ul>
        </div>
        <div
          className={`dot ${config.class}`}
          style={{ background: config.dotBj }}
        >
          <span className="dot-base dot-active"/>
          <span className="dot-base"/>
          <span className="dot-base"/>
          <span className="dot-base"/>
        </div>
      </div>
    )
  }
}
