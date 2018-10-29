import * as React from 'react'
import { ELanguageEnv } from '../../reducer/main';
import localWithKey from '../../language';

export interface ISofaProps {
  language?: ELanguageEnv
}

export default class Sofa extends React.Component<ISofaProps> {
  render() {
    const { language } = this.props
    return (
      <div className="c-e">
        <i className="iconfont icon-shafa icon" />
        <span className="c-e-h">{localWithKey(language, 'sofa')}</span>
      </div>
    )
  }
}
