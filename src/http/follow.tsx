import * as http from '../utils/http'
import { postApi } from '../utils/config'
import { IBaseAuth } from './user'

export enum EFollowType {
  USER = 0,
  POST,
  QUESTION,
  COMMENT,
  SPECIAL
} 

export interface ICreateOrDelParams extends IBaseAuth {
  objectId: string
  type: EFollowType
}

/**
 * follow - not
 * @param params 
 * @param callback 
 */
export function createOrDel(
  params: ICreateOrDelParams,
  callback: (err: string) => void,
): void {
  http.post(
    postApi,
    'Follow.CreateOrDel',
    params,
    err => callback(err)
  )
}
