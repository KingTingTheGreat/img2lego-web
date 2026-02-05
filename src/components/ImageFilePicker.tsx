import { useMemo, useRef, useState } from 'react'

const maxFileSizeMB = 4 as const

// define props
interface ImageFilePickerProps {
  fileState: [File | null, React.Dispatch<React.SetStateAction<File | null>>]
  bgColor?: string
}

export default function ImageFilePicker({
  fileState,
  bgColor,
}: ImageFilePickerProps) {
  const [file, setFile] = fileState
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const filename = useMemo(() => (file ? file.name : ''), [file])

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null

    // Clean up previous object URL (if any)
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    if (!nextFile) {
      setFile(null)
      setPreviewUrl(null)
      return
    }

    if (nextFile.size > maxFileSizeMB * 1024 * 1024) {
      e.target.value = ''
      setFile(null)
      setPreviewUrl(null)
      alert(`File size exceeds the maximum limit of ${maxFileSizeMB}MB.`)
      return
    }

    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
  }

  return (
    <div
      className="max-w-sm rounded-xs overflow-hidden items-center"
      style={{ backgroundColor: bgColor || 'white' }}
    >
      <div className="px-4 py-4">
        {/* Hidden input */}
        <input
          ref={inputRef}
          id="upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
          // Prevent bubbling when the input itself is clicked
          onClick={(e) => e.stopPropagation()}
        />

        {/* Preview area */}
        <div
          id="image-preview"
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openFilePicker()
          }}
          className={
            'max-w-sm bg-gray-100 rounded-xs items-center text-center cursor-pointer'
          }
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              className="max-h-56 rounded-xs"
              alt={file ? `Preview of ${file.name}` : 'Image preview'}
            />
          ) : (
            <div className="p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-gray-700 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                Upload picture
              </h5>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                Choose photo size should be less than{' '}
                <b className="text-gray-600">{maxFileSizeMB}MB</b>
              </p>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                and should be in{' '}
                <b className="text-gray-600">JPG, PNG, or GIF</b> format.
              </p>
              <span id="filename" className="text-gray-500 bg-gray-200 z-50">
                {filename}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
