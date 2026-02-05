import { Route } from '@/routes/about'

interface BGColorPickerProps {
  bgColorState: [string, React.Dispatch<React.SetStateAction<string>>]
}

export default function BGColorPicker({ bgColorState }: BGColorPickerProps) {
  const { bgColors, colorNames } = Route.useLoaderData()
  const [bgColor, setBgColor] = bgColorState

  return (
    <select onChange={(e) => setBgColor(e.target.value)} value={bgColor}>
      {bgColors.map((color, index) => (
        <option key={index} value={color} className="flex justify-between">
          <span>{colorNames[color] || color}</span>
        </option>
      ))}
    </select>
  )
}
