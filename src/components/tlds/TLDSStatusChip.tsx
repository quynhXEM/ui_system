import { Typography } from "@mui/material"

import { useDictionary } from "@/contexts/dictionaryContext"
import { TLDSStatus } from "@/data/items/tlds"

const TLDSStatusChip = ({ status }: { status: string }) => {
  const { dictionary } = useDictionary()

  const getColor = () => {
    return TLDSStatus.find(tlds => tlds.label === status)?.color
  }

  return (
    <div className="flex gap-1 items-center px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'var(--mui-palette-action-hover)' }}>
      <div className="w-2 h-2 rounded" style={{ backgroundColor: getColor() }} />
      <Typography variant="body2">{dictionary[status as keyof typeof dictionary]}</Typography>
    </div>
  )
}

export default TLDSStatusChip
