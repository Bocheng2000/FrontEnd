import * as React from 'react'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import { connect } from 'react-redux'
import Banner from './component/banner'
import Special from './component/special'
import { IStoreState } from '../../reducer'
import { EFontColor, EFontFamily, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import PostList from './postList'

interface IHomeProps {
  fontFamily: EFontFamily
  fontColor: EFontColor
  language: ELanguageEnv
  mode: ESystemTheme
}

const styles = {
  overrideMargin: {
    marginLeft: 0,
    marginRight: 0,
  },
  overridePadding: {
    paddingLeft: 0,
    paddingRight: 0,
  }
}

class Home extends React.Component<IHomeProps> {
  render() {
    const { fontFamily, mode, language } = this.props
    return (
      <div className="base-body">
        <Banner />
        <Row id="home-body" gutter={24} style={styles.overrideMargin}>
          <Col span={16} style={styles.overridePadding}>
            <Special fontFamily={fontFamily} mode={mode} language={language} />
            <PostList fontFamily={fontFamily} mode={mode} language={language} />
          </Col>
          <Col span={1} />
          <Col span={7} style={styles.overridePadding}>

          </Col>
        </Row>
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

export default connect(mapStateToProps)(Home)
