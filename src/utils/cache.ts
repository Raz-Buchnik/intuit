export const makeCache = (fn: Function, timeout?: number) => {
  const keys: any = {}
  return (...args: any[]) => {
    const cache = keys[JSON.stringify(args)]
    if (
      !cache ||
      (
        cache &&
        cache.timeout &&
        new Date().getTime() > cache.timeout
      )
    ) {
      const value = fn(...args)
      keys[JSON.stringify(args)] = {
        value,
        ...(timeout) ? {
          timeout: new Date().getTime() + timeout
        } : {}
      }
      return value
    }
    return cache.value
  }
}
