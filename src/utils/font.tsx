import { EFontFamily, EFontColor, ESystemTheme } from '../reducer/main'

export function getFontFamily(font: EFontFamily): string {
  switch(font) {
    case EFontFamily.songti:
      return 'Songti SC, PingFang SC'
    default:
      return 'Microsoft Yahei, PingFang SC'
  }
}

export function getFontColor(color: EFontColor): string {
  switch(color) {
    case EFontColor.day:
      return '#333333'
    default:
      return '#C8C8C8'
  }
}

export function getThemeColor(mode: ESystemTheme): string {
  switch (mode) {
    case ESystemTheme.day:
      return '#FFFFFF';
    default:
      return '#3F3F3F'
  }
}