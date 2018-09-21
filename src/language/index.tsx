import { ELanguageEnv } from '../reducer/main'
const zhHans = require('./zh-hans.json')
const zhHant = require('./zh-hant.json')
const en = require('./en.json')

export default function localWithKey(language: ELanguageEnv, key: string): string {
  switch (language) {
    case ELanguageEnv.en:
      return en[key] || ''
    case ELanguageEnv.zhHant:
      return zhHant[key] || ''
    default:
      return zhHans[key] || ''
  }
}