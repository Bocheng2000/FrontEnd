import { ILoginResponse } from '../http/user'
import { IUpdateKeyValue } from '../action/user'
import * as instance from '../utils/instance'

export interface IUserState {
  info?: ILoginResponse
}

function getInfo() {
  const u = localStorage.getItem('user')
  if (u) {
    const json = JSON.parse(u)
    instance.setValueByKey('info', json)
    return json
  }
  return undefined
}

const initState: IUserState = {
  info: getInfo(),
}

export default function user(state: IUserState = initState, action: any): IUserState {
  let act
  switch (action.type) {
    case 'User/update_key_value':
      act = action as IUpdateKeyValue
      return {
        ...state,
        [act.key]: action.value,
      }
    default:
      return state
  }
}