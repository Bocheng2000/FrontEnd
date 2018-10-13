import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import reducers from '../reducer'

export default function () {
  if (process.env.NODE_ENV === 'production') {
    window.console.log = undefined
    window.console.warn = undefined
    window.console.error = undefined
    window.console.info = undefined
    return applyMiddleware(thunkMiddleware)(createStore)(reducers)
  }
  return applyMiddleware(thunkMiddleware, logger)(createStore)(reducers)
}