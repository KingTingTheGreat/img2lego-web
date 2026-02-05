export function computePartsList(
  data: Array<Array<string>>,
  colorNames: Record<string, string>,
): Array<{ color: string; colorName: string; count: number }> {
  const partsCount: Record<string, number> = {}

  data.forEach((row) => {
    row.forEach((color) => {
      if (partsCount[color]) {
        partsCount[color] += 1
      } else {
        partsCount[color] = 1
      }
    })
  })

  const partsList = Object.entries(partsCount).map(([color, count]) => ({
    color,
    colorName: colorNames[color] || color,
    count,
  }))

  partsList.sort((a, b) => b.count - a.count)

  return partsList
}
