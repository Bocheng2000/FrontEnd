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

export interface IFindPreviewParams {
  id: string
  userId?: string
}

export interface IFindPreviewResponse {
  avatar: string
  followerCount: number
  id: string
  introduction: string
  isFollow: boolean
  questionCount: number
  shareCount: number
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

/**
 * 获取专题的预览
 * @param params 
 * @param callback 
 */
export function findPreview(
  params: IFindPreviewParams,
  callback: (err: string, data?: IFindPreviewResponse) => void
): void {
  http.post(postApi, 'Special.Preview', params, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, data[0] as IFindPreviewResponse)
    }
  })
}
