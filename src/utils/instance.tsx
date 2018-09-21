let instance: { [key: string]: any } = {}

/**
 * 设置属性值
 * @param key 
 * @param value 
 */
export function setValueByKey(key: string, value: any): void {
  instance[key] = value
}

/**
 * 根据key获取value
 * @param key 
 */
export function getValueByKey(key: string): any {
  return instance[key]
}

/**
 * 移除指定的key
 * @param key 
 */
export function removeValueByKey(key: string): void {
  delete instance[key]
}

/**
 * 清空
 */
export function clear(): void {
  for (let key in instance) {
    delete instance[key]
  }
}
