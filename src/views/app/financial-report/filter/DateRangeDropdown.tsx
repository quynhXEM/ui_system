
import React, { useEffect, useRef, useState } from 'react'


import { Grid, MenuItem } from '@mui/material'


import { format, addDays } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

interface DateRangeDropdownProps {
  setTimeDropdown: React.Dispatch<React.SetStateAction<boolean>>
  setValueShowSelect: React.Dispatch<React.SetStateAction<String>>
}

const DateRangeDropdown: React.FC<DateRangeDropdownProps> = ({ setTimeDropdown, setValueShowSelect }) => {
  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 15))

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  function formatDate(date: Date) {
    const datefmt = format(date, 'dd/MM/yyyy')

    return datefmt
  }

  const handlerClose = () => {
    setValueShowSelect(`${formatDate(startDate)} to ${endDate !== null ? formatDate(endDate) : ''}`)
    setTimeDropdown(false)
  }

  const prevOpen = useRef(open)

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <Grid>
      <AppReactDatepicker
        selectsRange
        endDate={endDate}
        selected={startDate}
        startDate={startDate}
        onCalendarClose={handlerClose}
        id='date-range-picker'
        onChange={handleOnChange}
        customInput={<MenuItem>Tùy chỉnh</MenuItem>}
      />
    </Grid>
  )
}

export default DateRangeDropdown
