import { combineReducers } from 'redux'
import main, { IMainState } from './main'

export interface IStoreState {
  main: IMainState,
}

export default combineReducers({
  main,
})