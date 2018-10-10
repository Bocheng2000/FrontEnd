import * as $ from 'jquery'
import { IUpdateKeyValue, IUpdateSystemConfig } from '../action/main'
import { getThemeColor } from '../utils/font'

export enum ESystemTheme {
  day = 0,
  night
}

export enum ELanguageEnv {
  zhHans = 0,
  zhHant,
  en
}

export enum EFontColor {
  day = 0,
  night,
}

export enum EFontFamily {
  yahei = 0,
  songti
}

export interface IMainState {
  system: {
    mode: ESystemTheme,
    fontFamily: EFontFamily,
    language: ELanguageEnv,
    fontColor: EFontColor,
  },
  version: string,
}

function getConfig() {
  const mode = localStorage.getItem('mode')
  const fontFamily = localStorage.getItem('fontFamily')
  const fontColor = localStorage.getItem('fontColor')
  const language = localStorage.getItem('language')
  const o = {
    mode: !mode ? ESystemTheme.day : parseInt(mode),
    fontFamily: !fontFamily ? EFontFamily.yahei : parseInt(fontFamily),
    fontColor: !fontColor ? EFontColor.day : parseInt(fontColor),
    language: !language ? ELanguageEnv.zhHans : parseInt(language)
  }
  $('body').css('background', getThemeColor(o.mode))
  return o
}

const initState: IMainState = {
  system: getConfig(),
  version: '1.0.0',
}

export default function main(state: IMainState = initState, action: any): IMainState {
  let act
  switch (action.type) {
    case 'Main/update_key_value':
      act = action as IUpdateKeyValue
      return {
        ...state,
        [act.key]: action.value,
      }
    case 'Main/update_system_kv':
      act = action as IUpdateSystemConfig
      return {
        ...state,
        system: {
          ...state.system,
          ...act.kv,
        }
      }
    default:
      return state
  }
}