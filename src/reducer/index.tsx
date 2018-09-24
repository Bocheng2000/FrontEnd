import { combineReducers } from 'redux'
import main, { IMainState } from './main'
import user, { IUserState } from './user'

export interface IStoreState {
  main: IMainState,
  user: IUserState,
}

export default combineReducers({
  main,
  user,
})