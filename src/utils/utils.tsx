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
  if (count < 10000)
    return `${(count / 10000).toFixed(1)} K`
  if (count < 1000000)
    return `${(count / 1000000).toFixed(1)} W`
  return `${(count / 100000000).toFixed(1)} M`
}