export function formatTime(milliseconds: number = 0) {
  if (milliseconds < 1000) {
    return `${milliseconds} ms`
  }

  if (milliseconds < 1000 * 60) {
    const seconds = milliseconds / 60

    return `${seconds.toFixed(2)} s`
  }

  return '0'
}
