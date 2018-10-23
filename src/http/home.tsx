import * as http from '../utils/http'
import { postApi } from '../utils/config'
import { IBaseAuth } from './user'

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

export interface IListPreviewParams {
  userId?: string
  targetId: string
}

export interface IListPreviewResponse {
  answerCount: number
  avatar: string
  cover: string
  followerCount: number
  id: string
  isFollow: boolean
  name: string
  postCount: number
  whatIsUp: string
}

export interface IPostCreateParams extends IBaseAuth {
  cover?: string
  title: string
  content: string
  specialId: string
}

export interface IPostCreateResponse {
  id: string
}

export interface IPostDetailParams {
  userId?: string
  id: string
}

export enum EPostDetailState {
  NORMAL = 0,
  DELETED
}

export interface IPostDetailPost {
  collectCount: number
  commentCount: number
  content: string
  cover: string
  createdAt: string
  id: string
  isCollect: boolean
  isLike: boolean
  likeCount: number
  readCount: number
  state: EPostDetailState
  title: string
  wordsCount: number
}

export interface IPostDetailSpecial {
  id: string
  avatar: string
  title: string
}

export interface IPostDetailUser {
  avatar: string
  id: string
  isFollow: boolean
  name: string
}

export interface IPostDetailResponse {
  post: IPostDetailPost
  special: IPostDetailSpecial
  user: IPostDetailUser
}

export interface IQuestionPreviewParams {
  id: string
  userId?: string
}

export enum EQuestionState {
  NORMAL = 0,
  DELETED
}

export interface IQuestionPreviewResponse {
  commentCount: number
  createdAt: string
  followerCount: number
  id: string
  introduction: string
  isFollow: boolean
  specialId: string
  specialTitle: string
  state: EQuestionState
  title: string
  visitCount: number
}

export interface IAnswerListParams {
  answerId?: string
  questionId: string
  userId?: string
  maxId?: string
  pageSize: number
  allAnswerCount: boolean
}

export interface IAnswerListAnswerModel {
  collectCount: number
  commentCount: number
  content: string
  createdAt: string
  followCount: number
  id: string
  isCollect: boolean
  isFollow: boolean
  readCount: number
  state: EPostDetailState
  title: string
}

export interface IAnswerListSpecialModel {
  avatar: string
  id: string
  title: string
}

export interface IAnswerListUserModel {
  avatar: string
  id: string
  name: string
  whatIsUp: string
  answerCount?: number
  cover?: string
  followerCount?: number
  isFollow?: boolean
  postCount?: number
}

export interface IAnswerListModel {
  answer: IAnswerListAnswerModel
  special: IAnswerListSpecialModel
  user: IAnswerListUserModel
}

export interface IAnswerListResponse {
  answer: IAnswerListModel
  answerCount: number
  list: Array<IAnswerListModel>
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
  http.post(postApi, 'Post.Banner', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result as Array<IFindBannerResponse>)
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
  http.post(postApi, 'Special.Recommend', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result as Array<IFindSpecialResponse>)
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
  http.post(postApi, 'Post.List', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result as Array<IFindListResponse>)
    }
  })
}

/**
 * 获取用户简要信息
 * @param params 
 * @param callback 
 */
export function listPreview(
  params: IListPreviewParams,
  callback: (err: string, data?: IListPreviewResponse) => void
): void {
  http.post(postApi, 'User.ListPreview', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result[0] as IListPreviewResponse)
    }
  })
}

/**
 * 创建post
 * @param params 
 * @param callback 
 */
export function createPost(
  params: IPostCreateParams,
  callback:(err: string, result?: IPostCreateResponse) => void
): void {
  http.post(postApi, 'Post.Create', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result[0] as IPostCreateResponse)
    }
  })
}

/**
 * 获取帖子详情
 * @param params 
 * @param callback 
 */
export function postDetail(
  params: IPostDetailParams,
  callback: (err: string, data?: IPostDetailResponse) => void
): void {
  http.post(postApi, 'Post.Detail', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result[0] as IPostDetailResponse)
    }
  })
}

/**
 * 根据ID获取预览的问题面板
 * @param params 
 * @param callback 
 */
export function questionPreview(
  params: IQuestionPreviewParams,
  callback: (err: string, data?: IQuestionPreviewResponse) => void
): void {
  http.post(postApi, 'Question.Preview', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result[0] as IQuestionPreviewResponse)
    }
  })
}

/**
 * 获取回答的信息 (具体回答/回答列表)
 * @param params 
 * @param callback 
 */
export function answerList(
  params: IAnswerListParams,
  callback: (err: string, data?: IAnswerListResponse) => void
): void {
  http.post(postApi, 'Question.AnswerList', params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, result[0] as IAnswerListResponse)
    }
  })
}
