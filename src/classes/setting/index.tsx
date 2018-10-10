import * as React from 'react'
import { connect } from 'react-redux'
import { getFontFamily, getFontColor } from '../../utils/font'
import { EFontFamily, EFontColor, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import { IStoreState } from '../../reducer'
import localWithKey from '../../language'
import BaseSetting from './baseSetting'
import PersonInfo from './personInfo'
import * as instance from '../../utils/instance'

interface ISettingProps {
  fontFamily: EFontFamily
  fontColor: EFontColor
  language: ELanguageEnv
  mode: ESystemTheme
}

interface ISettingDatsSource {
  icon: string
  title: string
}

interface ISettingState {
  index: number
}

class Setting extends React.Component<ISettingProps, ISettingState> {

  constructor(props: ISettingProps) {
    super(props)
    this.state = {
      index: 0,
    }
  }

  generateMenus(): Array<ISettingDatsSource> {
    const { language } = this.props
    return [
      {
        icon: 'icon-ziliaoku',
        title: localWithKey(language, 'person-info'),
      },
      {
        icon: 'icon-yijicaidan',
        title: localWithKey(language, 'base-setting'),
      },
      {
        icon: 'icon-renminbi',
        title: localWithKey(language, 'admired-setting'),
      },
      {
        icon: 'icon-shezhi1',
        title: localWithKey(language, 'account-manager'),
      }
    ]
  }

  renderContent() {
    const { index } = this.state
    switch (index) {
      case 0:
        return <PersonInfo />
      case 1:
        return <BaseSetting />
      default:
        return null
    }
  }

  renderMenus(className: string, color: string) {
    const { index } = this.state
    return this.generateMenus().map((e, i) => (
      <div
        key={e.icon}
        className={i === index ? `${className}-high` : className}
        onClick={() => {
          if (index !== i) {
            this.setState({ index: i })
          }
        }}
      >
        <i className={`iconfont ${e.icon} icon`} />
        <span
          className="text"
          style={{ color }}
        >{e.title}</span>
      </div>
    ))
  }

  render() {
    const { fontFamily, fontColor, mode } = this.props
    const color = getFontColor(fontColor)
    let className
    let content
    if (mode === ESystemTheme.day) {
      className = 'cell'
      content = 'content content-day'
    } else {
      className = 'cell-night'
      content = 'content content-night'
    }
    return (
      <div
        id="setting"
        className="base-body"
        style={{ fontFamily: getFontFamily(fontFamily) }}
      >
        <div className="menu">
          {this.renderMenus(className, color)}
        </div>
        <div className={content}>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  main: { system: { fontFamily, fontColor, language, mode } }
}: IStoreState) {
  return {
    fontFamily,
    fontColor,
    language,
    mode,
  }
}

export default connect(mapStateToProps)(Setting)