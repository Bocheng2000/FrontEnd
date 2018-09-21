import { IUpdateKeyValue, IUpdateSystemConfig } from '../action/main'

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

const initState: IMainState = {
  system: {
    mode: ESystemTheme.day,
    fontFamily: EFontFamily.yahei,
    fontColor: EFontColor.day,
    language: ELanguageEnv.zhHans,
  },
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