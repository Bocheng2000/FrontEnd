import * as http from '../utils/http'
import { postApi } from '../utils/config'
import { IBaseAuth } from './user'

export interface IFindByKeyParams {
  key: string
}

export interface IFindByKeyResponse {
  id: string
  avatar: string
  title: string
}

export function findByKey(
  params: IFindByKeyParams,
  callback: (err: string, result?: Array<IFindByKeyResponse>) => void
): void {
  http.post(postApi, 'Special.FindByKey', params, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, data as Array<IFindByKeyResponse>)
    }
  })
}
