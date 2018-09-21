import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import reducers from '../reducer'

export default function () {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(thunkMiddleware)(createStore)(reducers)
  }
  return applyMiddleware(thunkMiddleware, logger)(createStore)(reducers)
}