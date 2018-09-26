import { timeout, storageApi } from './config'
import * as instance from './instance'
import { ELanguageEnv } from '../reducer/main'

function findEd(): 'ed_en' | 'ed_hant' | 'ed_hans' {
  const lan = instance.getValueByKey('language') as ELanguageEnv
  switch (lan) {
    case ELanguageEnv.en:
      return 'ed_en'
    case ELanguageEnv.zhHant:
      return 'ed_hant'
    default:
      return 'ed_hans'
  }
}

function _fetch(fetch: Promise<Response>, timeout: number) {
  return Promise.race([
    fetch,
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('request timeout')), timeout)
    }),
  ])
}

export interface IResponseModel {
  code: number
  ed_hans?: string
  ed_hant?: string
  ed_en?: string
  data?: Array<any>
}

export interface IParamsModel {
  routeName: string
  queryString: string
}

/**
 * post 接口
 * @param api 
 * @param routeName 
 * @param params 
 * @param callback 
 */
export function post(
  api: string,
  routeName: string,
  params: object = {},
  callback: (err: string, data?: Array<any>) => void
) {
  _fetch(fetch(api, {
    method: "POST",
    body: JSON.stringify({
      routeName,
      queryString: JSON.stringify(params),
    }),
    headers: {
      'Content-Type': 'text/plain',
    },
  }), timeout)
    .then(r => (r as any).json())
    .then((r: IResponseModel) => {
      if (r.code === 200) {
        callback(undefined, r.data)
      } else {
        callback(r[findEd()])
      }
    })
    .catch(e => callback(e.message))
}

export function upload(
  api: string,
  sufix: string = "jpg",
  buffer: Buffer,
  callback: (err: string, result?: string) => void
) {
  _fetch(fetch(api, {
    method: 'POST',
    body: buffer,
    headers: {
      'Content-Type': 'octet-stream',
      sufix,
    },
  }), timeout)
  .then(r => (r as any).text())
    .then(r => callback(undefined, r))
    .catch(e => callback(e.message))
}

export function getHashUrl(hash: string): string {
  return `${storageApi}/storage/${hash}`
}
