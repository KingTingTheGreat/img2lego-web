interface LegofiedImageProps {
  data: Array<Array<string>>
  bgColor: string
  studSize: number
  gapSize: number
}

export default function LegofiedImage({
  data,
  bgColor,
  studSize,
  gapSize,
}: LegofiedImageProps) {
  return (
    <div
      className="w-fit h-fit"
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        gap: `${gapSize}px`,
        padding: '10px',
      }}
    >
      {data.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: `${gapSize}px` }}>
          {row.map((color, colIndex) => (
            <div
              key={colIndex}
              className="rounded-full"
              style={{
                width: `${studSize}px`,
                height: `${studSize}px`,
                backgroundColor: color,
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  )
}
