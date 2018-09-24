export interface IUpdateKeyValue {
  type: string,
  key: string,
  value: string,
}

export type UserActions = IUpdateKeyValue

export function updateKeyValue(key: string, value: any): IUpdateKeyValue {
  return {
    type: 'User/update_key_value',
    key,
    value,
  }
}
