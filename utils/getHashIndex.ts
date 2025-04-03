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

  const date = new Date()
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  const seed = hashCode(dateString)
  const index = Math.abs(seed % 68) + 1

  return index
}
