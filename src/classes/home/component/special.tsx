import * as React from 'react'
import { findSpecial, IFindSpecialResponse } from '../../../http/home'
import { getHashUrl } from '../../../utils/http'
import { EFontFamily, ELanguageEnv, ESystemTheme } from '../../../reducer/main'
import { getFontFamily } from '../../../utils/font'
import localWithKey from '../../../language';

export interface ISpecialProps {
  fontFamily: EFontFamily
  mode: ESystemTheme
  language: ELanguageEnv
}

interface ISpecialState {
  readonly dataSource: Array<IFindSpecialResponse>
}

class Special extends React.Component<ISpecialProps, ISpecialState> {
  constructor(props: ISpecialProps) {
    super(props)
    this.state = {
      dataSource: [],
    }
  }

  componentDidMount() {
    findSpecial({
      pageSize: 10,
    }, (err, data) => {
      if (!err && data && data.length) {
        this.setState({ dataSource: data })
      }
    })
  }

  getConfig() {
    const { mode } = this.props
    let res
    if (mode === ESystemTheme.day) {
      res = {
        backgroundColor: '#F7F7F7',
        color: '#333333',
        border: '1px solid #DCDCDC',
      }
    } else {
      res = {
        backgroundColor: '#4A4A4A',
        color: '#C8C8C8',
        border: '1px solid #2F2F2F',
      }
    }
    return res
  }

  renderItems(e: IFindSpecialResponse, config: any) {
    return (
      <div
        className="item"
        key={e.id}
        style={{
          border: config.border,
          color: config.color,
          background: config.backgroundColor,
        }}>
        <img className="icon" src={getHashUrl(e.avatar)} />
        <div className="title">{e.title}</div>
      </div>
    )
  }

  render() {
    const { dataSource } = this.state
    if (!dataSource.length) {
      return null
    }
    const { fontFamily, language } = this.props
    const config = this.getConfig()
    return (
      <div id="special" style={{ fontFamily: getFontFamily(fontFamily) }}>
        {dataSource.map(e => this.renderItems(e, config))}
        <div
          style={{
            color: config.color,
            display: 'inline-flex',
            cursor: 'pointer',
          }}
        >{`${localWithKey(language, 'more-special')} >`}</div>
      </div>
    )
  }
}

export default Special
