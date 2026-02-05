import { Route } from '@/routes/about'
import { computePartsList } from '@/util/computePartsList'
import { toCsv } from '@/util/toCsv'

const filename = 'img2lego_parts.csv'

const spacer = [[], ['Image']]

interface DownloadPartsListProps {
  data: Array<Array<string>>
}

export default function DownloadPartsList({
  data: imageData,
}: DownloadPartsListProps) {
  const { colorNames } = Route.useLoaderData()

  const partsList = computePartsList(imageData, colorNames)
  const partsData = [['Color', 'Color Name', 'Count']].concat(
    partsList.map((part) => [
      part.color,
      part.colorName,
      part.count.toString(),
    ]),
  )

  const data = partsData.concat(spacer).concat(imageData)

  const csvData = toCsv(data)
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  return (
    <a href={url} download={filename}>
      Download CSV
    </a>
  )
}
