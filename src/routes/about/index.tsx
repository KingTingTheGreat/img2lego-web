import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import LegofiedImage from '@/components/LegofiedImage'
import LoadingSpinner from '@/components/LoadingSpinner'
import ImageFilePicker from '@/components/ImageFilePicker'
import BGColorPicker from '@/components/BGColorPicker'
import DownloadPartsList from '@/components/DownloadPartsList'

const fileId = (file: File | null) =>
  file ? `file:${file.name}:${file.size}:${file.lastModified}` : 'file:null'

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
  loader: async () => {
    const bgColorsRes = await fetch('http://localhost:8080/bg-colors')
    const colorNamesRes = await fetch('http://localhost:8080/color-names')
    const colorNamesData = await colorNamesRes.json()
    const colorNames: Record<string, string> = {}
    for (const { color, name } of colorNamesData) {
      colorNames[color] = name
    }

    return {
      bgColors: (await bgColorsRes.json()) as Array<string>,
      colorNames,
    }
  },
})

function RouteComponent() {
  const { bgColors } = Route.useLoaderData()
  const [file, setFile] = useState<File | null>(null)

  const [bgColor, setBgColor] = useState(bgColors[0])
  const [width, setWidth] = useState(128)

  const queryClient = useQueryClient()

  const stableQueryKey = [fileId(file), width]

  const {
    data: legofiedImageData,
    error,
    isFetching,
    refetch: convertImage,
  } = useQuery({
    queryKey: stableQueryKey,
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/convert?width=${width}`, {
        method: 'POST',
        body: file,
      })
      return (await res.json()) as Array<Array<string>>
    },
    initialData: null,
    enabled: false,
  })

  const submit = () => {
    if (!file) return
    const cached = queryClient.getQueryData(stableQueryKey)
    if (cached) return
    convertImage()
  }

  return (
    <section className="container w-full mx-auto flex flex-col items-center py-32">
      <ImageFilePicker fileState={[file, setFile]} bgColor={bgColor} />
      <div className="flex gap-12 mt-3 items-center">
        <BGColorPicker bgColorState={[bgColor, setBgColor]} />
        <div className="flex">
          <input
            type="range"
            min="16"
            max="512"
            step="16"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
          <p>Width: {width}</p>
        </div>
      </div>

      <br />

      <button
        type="button"
        onClick={submit}
        className="text-white bg-[#050708] hover:bg-[#050708]/90 rounded-lg text-sm px-5 py-2.5 flex text-center"
      >
        Submit
      </button>

      {isFetching ? (
        <LoadingSpinner />
      ) : (
        legofiedImageData && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <LegofiedImage
              data={legofiedImageData}
              bgColor={bgColor}
              studSize={2}
              gapSize={0.5}
            />
            <DownloadPartsList data={legofiedImageData} />
          </div>
        )
      )}
    </section>
  )
}
