import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import './style/index.less'
import Routers from './classes/routers'
import { setValueByKey } from './utils/instance'

const store = configureStore()
setValueByKey('__store__', store)

ReactDOM.render(
  <Provider store={store}>
    <Routers />
  </Provider>
  ,
  document.getElementById('root') as HTMLElement
);