import * as http from '../utils/http'
import { postApi } from '../utils/config'

export interface IFindBannerParams {
  pageSize: number,
}

export interface IFindBannerResponse {
  cover: string
  id: string
  title: string
}

export interface IFindSpecialParams {
  pageSize: number
}

export interface IFindSpecialResponse {
  avatar: string
  id: string
  title: string
}

export interface IFindListParams {
  userId?: string
  maxId: string
  pageSize: number
}

export interface IFindListResponse {
  collectCount: number
  commentCount: number
  title: string
  content: string
  questionId: string
  cover: string
  followCount: number
  id: string
  userId: string
  userName: string
  avatar: string
}

/**
 * 获取Banner图
 * @param params 
 * @param callback 
 */
export function findBanner(
  params: IFindBannerParams,
  callback: (err: string, data?: Array<IFindBannerResponse>) => void,
): void {
  http.post(postApi, 'Post.Banner', params, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, data as Array<IFindBannerResponse>)
    }
  })
}

/**
 * 获取推荐的主题
 * @param params 
 * @param callback 
 */
export function findSpecial(
  params: IFindSpecialParams,
  callback: (err: string, data?: Array<IFindSpecialResponse>) => void,
): void {
  http.post(postApi, 'Special.Recommend', params, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, data as Array<IFindSpecialResponse>)
    }
  })
}

/**
 * 获取推荐列表
 * @param params 
 * @param callback 
 */
export function findList(
  params: IFindListParams,
  callback: (err: string, data?: Array<IFindListResponse>) => void
): void {
  http.post(postApi, 'Post.List', params, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, data as Array<IFindListResponse>)
    }
  })
}
