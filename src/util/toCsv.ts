export function toCsv(
  data: Array<Array<string | number | boolean | null | undefined>>,
): string {
  return data
    .map((row) =>
      row
        .map((cell) => {
          const s = cell == null ? '' : String(cell)
          const needsQuotes = /[",\n\r]/.test(s)
          const escaped = s.replace(/"/g, '""')
          return needsQuotes ? `"${escaped}"` : escaped
        })
        .join(','),
    )
    .join('\r\n')
}
