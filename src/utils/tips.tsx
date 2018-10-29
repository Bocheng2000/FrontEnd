export enum EShowTipsType {
  success = 0,
  warning,
  failed,
}

/**
 * animate 动画
 * @param obj 
 * @param json 
 * @param interval 
 * @param sp 
 * @param fn 
 */
function animate(obj: any, json: any, interval: number = 1, sp: number = 0.01, fn?: () => void) {
  clearInterval(obj.timer)
  function getStyle(obj: any, arr: any) {
    if (obj.currentStyle) {
      return obj.currentStyle[arr]
    } else {
      return document.defaultView.getComputedStyle(obj, null)[arr];
    }
  }
  obj.timer = setInterval(function () {
    var flag = true
    for (var arr in json) {
      var icur = 0
      if (arr == "opacity") {
        icur = Math.round(parseFloat(getStyle(obj, arr)) * 100)
      } else {
        icur = parseInt(getStyle(obj, arr))
      }
      var speed = (json[arr] - icur) * sp
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
      if (icur != json[arr]) {
        flag = false
      }
      if (arr == "opacity") {
        obj.style.filter = "alpha(opacity : '+(icur + speed)+' )"
        obj.style.opacity = (icur + speed) / 100
      } else {
        obj.style[arr] = icur + speed + "px"
      }
    }
    if (flag) {
      clearInterval(obj.timer)
      fn && fn()
    }
  }, interval)
}

/**
 * 错误/成功 弹框
 * @param content 
 * @param type 
 * @param delay 
 */
export function showTips(content: string, type: EShowTipsType = EShowTipsType.failed, delay: number = 2000) {
  const id = `tip${Date.now()}`
  let className
  if (type === EShowTipsType.success) {
    className = 'tips tips-succ'
  } else if (type === EShowTipsType.warning) {
    className = 'tips tips-warning'
  } else {
    className = 'tips tips-fail'
  }
  var object = document.createElement("div")
  object.setAttribute('id', id)
  object.setAttribute('class', className)
  object.innerHTML = content
  const parent = document.getElementsByTagName('body')[0]
  parent.appendChild(object)
  animate(object, { height: 40 }, 1, 0.01)
  setTimeout(() => {
    animate(object, { height: 0 }, 1, 0.01, () => {
      parent.removeChild(object)
    })
  }, delay)
}