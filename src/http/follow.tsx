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

export interface IListParams {
  id: string
  userId?: string
  maxId?: string
  pageSize: number
}

export interface IListResponse {
  followId: string
  answerCount: number
  avatar: string
  followerCount: number
  id: string
  isFollow: boolean
  name: string
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

/**
 * Object的 follower 列表
 * @param params 
 * @param callback 
 */
export function list(
  params: IListParams,
  callback: (err: string, data?: Array<IListResponse>) => void
): void {
  http.post(postApi, 'Follow.List', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result as Array<IListResponse>)
    }
  })
}