import * as $ from 'jquery'

export enum EShowTipsType {
  success = 0,
  failed,
}

export function showTips(content: string, type: EShowTipsType, delay: number = 2000) {
  const id = `tip${Date.now()}`
  let className
  if (type === EShowTipsType.success) {
    className = 'tips tips-succ'
  } else {
    className = 'tips tips-fail'
  }
  $('body').append(`
    <div class="${className}" id="${id}">${content}</div> 
  `)
  const obj = $(`#${id}`)
  obj.animate({ height: '40px'}, 500)
  setTimeout(() => {
    obj.animate({ height: 0}, 500, undefined ,() => {
      obj.remove()
    })
  }, delay)
}