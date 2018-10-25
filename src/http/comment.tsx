import * as http from '../utils/http'
import { postApi } from '../utils/config'
import { IBaseAuth } from './user'

export enum ECommentType {
  POST = 0,
  SPECIAL,
  QUESTION
}

export enum ECommentState {
  NORMAL = 0,
  DELETED
}

export interface ICommentImageModel {
  image: string
  w: number
  h: number
}

export interface ICreateParams extends IBaseAuth {
  objectId: string
  type: ECommentType
  content: string
  images?: Array<ICommentImageModel>
  mentionUser?: Array<string>
  parentId: string
  rootId: string
}

export interface ICreateResponse {
  createdAt: string
  id: string
}

export interface IDeleteParams extends IBaseAuth {
  commentId: string
}

export interface IListParams {
  userId?: string
  objectId: string
  maxId?: string
  pageSize: number
  nextLvlSize: number
}

export interface ICommentModel {
  avatar: string
  childCount: number
  content: string
  createdAt: string
  id: string
  images: Array<ICommentImageModel>
  isLike: boolean
  likeCount: number
  name: string
  state: ECommentState,
  type: ECommentType
  userId: string
}

export interface ICommentChildModel {
  comment: ICommentModel
  parent: ICommentModel
}

export interface IListResponse {
  comment: ICommentModel
  children?: Array<ICommentChildModel>
}

/**
 * 创建评论
 * @param params 
 * @param callback 
 */
export function create(
  params: ICreateParams,
  callback: (err: string, data?: ICreateResponse) => void
): void {
  http.post(postApi, 'Comment.Create', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result[0] as ICreateResponse)
    }
  })
}

/**
 * 删除评论
 * @param params 
 * @param callback 
 */
export function del(
  params: IDeleteParams,
  callback: (err: string) => void,
): void {
  http.post(postApi, 'Comment.Delete', params, callback)
}

/**
 * 获取评论列表
 * @param params 
 * @param callback 
 */
export function list(
  params: IListParams,
  callback: (err: string, data?: Array<IListResponse>) => void
): void {
  http.post(postApi, 'Comment.List', params, (err, result) => {
    if (err)
      callback(err)
    else
      callback(undefined, result as Array<IListResponse> )
  })
}