export function generatePresentationCode(length: number = 11): string {
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomUUID().replace(/-/g, '').substring(0, length).toUpperCase()
    return code
  }
  return crypto.randomUUID().split('-')[0].substring(0, length).toUpperCase()
}
