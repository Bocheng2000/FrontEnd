export const postApi: string = 'http://127.0.0.1:8055/v1/api'
export const storageApi: string = 'http://127.0.0.1:9988'
/**
 * http 超时
 */
export const timeout: number = 30000
/**
 * 封面的宽
 */
export const cover_w: number = 900
/**
 * 封面的高
 */
export const cover_h: number = 350
/**
 * 头像的宽
 */
export const avatar_w: number = 200
/**
 * 头像的高
 */
export const avatar_h: number = 200
/**
 * 自动播放的时间
 */
export const autoplay: number = 5000
/**
 * 发送验证码的时间
 */
export const code_all: number = 120
/**
 * 动效
 */
export const animate_delay: number = 1000
/**
 * 每次加载的数量
 */
export const page_size: number = 10

/**
 * emoji 正则
 */
export const emoji_regex: RegExp = /\[:[^]]*(.*?):\]/g

/**
 * at 正则
 */
export const at_regex: RegExp = /\@[^\s]]*(.*?)\s/g

/**
 * tag 正则
 */
export const tag_regex: RegExp = /\#[^]]*(.*?)\#/g
