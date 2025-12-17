export function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export function toQueryString(params: Record<string, string | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v.trim().length) u.set(k, v);
  });
  const s = u.toString();
  return s ? `?${s}` : '';
}