import * as React from 'react'
import { connect } from 'react-redux'
import Loading from './loading'
import { IStoreState } from '../../../reducer'
import { ESystemTheme } from '../../../reducer/main'

interface IBaseSettingProps {
  mode: ESystemTheme
}

class BaseSetting extends React.Component<IBaseSettingProps> {
  render() {
    const { mode } = this.props
    return <Loading mode={mode} />
  }
}

function mapStateToProps({
  main: { system: { fontFamily, fontColor, language, mode } },
}: IStoreState) {
  return {
    mode,
  }
}

export default connect(mapStateToProps)(BaseSetting)