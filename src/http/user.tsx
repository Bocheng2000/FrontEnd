import * as moment from 'moment'
import * as md5 from 'js-md5'
import * as http from '../utils/http'
import { postApi } from '../utils/config'
import { ELanguageEnv, ESystemTheme } from '../reducer/main'

export interface ILoginParams {
  phone: string
  password: string
}

export enum ESendCodeType {
  REGIST = 0,
  FASTLOGIN,
  RESETPASSWORD,
  CHANGEPHONE,
  OTHER
}

export interface ISendCodeParams {
  language: ELanguageEnv
  terminal: string
  type: ESendCodeType
}

export interface ICreateParams {
  phone: string
  password: string
  name: string
  code: number
}

export enum EUserOnce {
  INIT = 0,
  CHANGED,
}

export enum EUserSex {
  SECRECY = 0,
  MALE,
  FEMALE,
  UNKNOW
}

export enum EUserState {
  NORMAL = 0,
  FROZEN
}

export enum ESettingEditor {
  RICHTEXT = 0,
  MACDOWN
}

export enum ESettingReceive {
  ALL = 0,
  FOLLOW
}

export enum ESettingEmail {
  ALL = 0,
  REFUSE,
}

export interface ILoginResponse {
  avatar: string
  birthday: string
  cover: string
  id: string
  idString: string
  name: string
  once: EUserOnce
  sex: EUserSex
  state: EUserState
  token: string
  wallet: number
  whatIsUp: string
}

export interface ISettingResponse {
  bindEmail: string
  bindPhone: string
  editor: ESettingEditor
  emailNotice: ESettingEmail
  language: ELanguageEnv
  receiveNotice: ESettingReceive
  theme: ESystemTheme
  userId: string
}

export interface IBaseAuth {
  id: string
  token: string
}

export interface IModifySensitiveParams extends IBaseAuth {
  name?: string
  whatIsUp?: string
  avatar?: string
  cover?: string
}

export interface IModifyBaseInfoParams extends IBaseAuth {
  sex?: EUserSex
  birthday?: string
}

export interface IUpdateSettingParams extends IBaseAuth {
  editor?: ESettingEditor
  language?: ELanguageEnv
  theme?: ESystemTheme
  receiveNotice?: ESettingReceive
  emailNotice?: ESettingEmail
}

export interface IModifyIdStringParams extends IBaseAuth {
  next: string
  update: boolean
}

/**
 * 登录
 * @param params 
 * @param callback 
 */
export function login (
  params: ILoginParams,
  callback: (err: string, response?: ILoginResponse) => void
): void {
  const sort = moment(Date.now()).format('YYYYMMDDHHmm')
  const hashSort = `${md5.hex(params.password)}${sort}`
  http.post(postApi, 'User.Login', {
    phone: params.phone,
    password: md5.hex(hashSort),
  }, (err, d) => {
    if (err)
      callback(err)
    else 
      callback(undefined, d[0] as ILoginResponse)
  })
}

/**
 * 发送验证码
 * @param params 
 * @param callback 
 */
export function sendCode (
  params: ISendCodeParams,
  callback: (err: string) => void,
): void {
  http.post(postApi, 'Code.SendCode', params, (err) => {
    callback(err)
  })
}

/**
 * 用户注册
 * @param params 
 * @param callback 
 */
export function create(
  params: ICreateParams,
  callback: (err: string, response?: ILoginResponse) => void,
): void {
  const hash = md5.hex(params.password)
  http.post(postApi, 'User.Create', {
    ...params,
    password: hash,
  }, (err, d) => {
    if (err)
      callback(err)
    else 
      callback(undefined, d[0] as ILoginResponse)
  })
}

/**
 * 修改敏感信息
 * @param params 
 * @param callback 
 */
export function modifySensitive(
  params: IModifySensitiveParams,
  callback: (err: string) => void
): void {
  http.post(
    postApi,
    'User.ModifySensitive',
    params,
    callback)
}

/**
 * 修改基本的信息
 * @param params 
 * @param callback 
 */
export function modifyBaseInfo(
  params: IModifyBaseInfoParams,
  callback: (err: string) => void
): void {
  http.post(
    postApi,
    'User.ModifyBaseInfo',
    params,
    callback)
}

/**
 * 获取设置信息
 * @param params 
 * @param callback 
 */
export function findSetting(
  params: IBaseAuth,
  callback: (err: string, result?: ISettingResponse) => void
): void {
  http.post(postApi, 'User.MySetting', params, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(undefined, data[0] as ISettingResponse)
    }
  })
}

/**
 * 更新设置
 * @param params 
 * @param callback 
 */
export function updateSetting(
  params: IUpdateSettingParams,
  callback: (err: string) => void
): void {
  http.post(
    postApi,
    'User.UpdateSetting',
    params,
    callback
  )
}

/**
 * 修改IDString
 * @param params 
 * @param callback 
 */
export function modifyIdString(
  params: IModifyIdStringParams,
  callback: (err: string) => void
): void {
  http.post(
    postApi,
    'User.ModifyIdString',
    params,
    callback
  )
}