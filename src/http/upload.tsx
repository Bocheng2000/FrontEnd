import * as http from '../utils/http'
import { storageApi } from '../utils/config'

/**
 * 上传
 * @param sufix 
 * @param blob 
 * @param callback 
 */
export function upload(
  sufix: string,
  buffer: Buffer,
  callback: (err: string, result?: string) => void
) {
  const api = `${storageApi}/storage/upload`
  http.upload(api, sufix, buffer, callback)
}