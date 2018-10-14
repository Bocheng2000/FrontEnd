import * as http from '../utils/http'
import { postApi } from '../utils/config'
import { IBaseAuth } from './user'

export enum ECollectType {
  POST = 0,
}

export interface ICreateOrDelParams extends IBaseAuth {
  objectId: string
  type: ECollectType
}

/**
 * 收藏/取消收藏
 * @param params 
 * @param callback 
 */
export function createOrDel(
  params: ICreateOrDelParams,
  callback: (err: string) => void
): void {
  http.post(postApi, 'Collect.CreateOrDel', params, callback)
}
