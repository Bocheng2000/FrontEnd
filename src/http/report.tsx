import * as http from '../utils/http'
import { postApi } from '../utils/config'
import { IBaseAuth } from './user'

export enum EReportType {
  POST = 0,
  USER,
  COMMENT,
  SPECIAL,
  QUESTION
}

export interface IReportParams extends IBaseAuth {
  objectId: string
  reason: string
  opt: string
  type: EReportType
}

export function report(
  params: IReportParams,
  callback: (err: string) => void
) {
  http.post(postApi, 'Report.Create', params, callback)
}
