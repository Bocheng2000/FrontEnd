import * as moment from 'moment'
import * as instance from './instance'
import { IStoreState } from '../reducer'
import localWithKey from '../language';

/**
 * isPhone
 * @param phone 
 */
export function isPhone(phone: string): boolean {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  return reg.test(phone)
}

/**
 * isEmail
 * @param email 
 */
export function isEmail(email: string): boolean {
  const reg = /^([a-zA-Z0-9_-|.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * isCode
 * @param code 
 */
export function isCode(code: string): boolean {
  const reg = /^\d{6}\b/
  return reg.test(code)
}

/**
 * 截取文本
 * @param text 
 */
export function clipText(text: string): string {
  if (text.length > 70) {
    return text.substring(0, 68) + '...'
  }
  return text
}

/**
 * 转换数字
 * @param count 
 */
export function parseNumber(count: number): string {
  if (count < 1000)
    return count.toString()
  if (count <= 100000)
    return `${(count / 1000).toFixed(1)}k`
  return `${(count / 1000000).toFixed(1)}m`
}

/**
 * 换算时间差
 * @param date 
 */
export function dateDiff(date: string): string {
  const store = instance.getValueByKey('__store__').getState() as IStoreState
  const { language } = store.main.system
  const tsMoment = moment(date)
  if (!tsMoment.isValid()) return ""
  const now = Date.now()
  const interval = now - tsMoment.valueOf()
  if (interval < 0) return ""
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const minC = Math.floor(interval / minute)
  const hourC = Math.floor(interval / hour)
  const dayC = Math.floor(interval / day)
  const weekC = Math.floor(interval / week)
  const monthC = Math.floor(interval / month)
  if (monthC >= 1 && monthC <= 3) return `${monthC} ${localWithKey(language, 'month-ago')}`
  if (weekC >= 1 && weekC <= 3) return `${weekC} ${localWithKey(language, 'week-ago')}`
  if (dayC >= 1 && dayC <= 6) return `${dayC} ${localWithKey(language, 'day-ago')}`
  if (hourC >= 1 && hourC <= 23) return `${hourC} ${localWithKey(language, 'hour-ago')}`
  if (minC >= 1 && minC <= 59) return `${minC} ${localWithKey(language, 'minute-ago')}`
  if (interval >= 0 && interval <= minute) return localWithKey(language, 'just-now')
  return tsMoment.format("YYYY-MM-DD")
}
