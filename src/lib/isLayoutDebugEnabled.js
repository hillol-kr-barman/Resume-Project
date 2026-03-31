export function isLayoutDebugEnabled() {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('debug-layout') === '1'
}
