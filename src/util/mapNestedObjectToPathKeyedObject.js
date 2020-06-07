import { isObject } from 'lodash'

export function mapNestedObjectToPathKeyedObject (object) {
  const resultObject = {}
  const sub = (obj, parentPath) => {
    for (const key in obj) {
      const path = (parentPath ? `${parentPath}.` : '') + key
      const value = obj[key]
      if (isObject(value)) sub(value, path)
      else resultObject[path] = value
    }
  }
  sub(object)
  return resultObject
}
