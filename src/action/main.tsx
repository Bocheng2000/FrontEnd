export interface IUpdateKeyValue {
  type: string,
  key: string,
  value: string,
}

export interface IUpdateSystemConfig {
  type: string,
  kv: object,
}

export type MainActions = IUpdateKeyValue | IUpdateSystemConfig

export function updateKeyValue(key: string, value: any): IUpdateKeyValue {
  return {
    type: 'Main/update_key_value',
    key,
    value,
  }
}

export function updateSystemConfig(kv: object): IUpdateSystemConfig {
  return {
    type: 'Main/update_system_kv',
    kv,
  }
}