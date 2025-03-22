export function getHashIndex() {
  // Simple hash function for consistent random selection based on date
  const hashCode = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; ++i) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash | 0 // Convert to 32-bit integer
    }
    return hash
  }

  const now = new Date()
  const dateString = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)

  // Format it as YYYY-MM-DD
  const formattedDate = dateString.replace(/\//g, '-')
  const seed = hashCode(formattedDate)
  const index = Math.abs(seed % 68) + 1

  return index
}
