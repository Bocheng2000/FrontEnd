import * as React from 'react'
import { ELanguageEnv } from '../../reducer/main'
import localWithKey from '../../language'
import * as instance from '../../utils/instance'

export interface ISignHeaderProps {
  language: ELanguageEnv;
  index: number;
}

class SignHeader extends React.Component<ISignHeaderProps> {
  render() {
    const { language, index } = this.props
    return (
      <div id="signHeader">
        <span
          className={index === 0 ? "btn high" : "btn"}
          onClick={() => {
            if (index === 0)
              return
            instance.getValueByKey('history').push('/l')
          }}
        >{localWithKey(language, 'login')}</span>
        <span
          className="point"
        >·</span>
        <span
          className={index === 1 ? "btn high" : "btn"}
          onClick={() => {
            if (index === 1)
              return
            instance.getValueByKey('history').push('/r')
          }}
        >{localWithKey(language, 'register')}</span>
      </div>
    )
  }
}

export default SignHeader