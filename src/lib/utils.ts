export function ensure<T>(v: T | null | undefined, msg = 'Missing value'): T {
  if (v === null || v === undefined) throw new Error(msg)
  return v
}

export function uid(){
  return Math.random().toString(36).slice(2,9)
}
