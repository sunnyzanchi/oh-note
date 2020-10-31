// Remove duplicates from an array
const dedup = function <T>(list: Array<T>): Array<T> {
  return Array.from(new Set(list))
}

export default dedup
