import React, { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { Grid } from '@mui/material'


import DateRangeDropdown from '@/views/app/financial-report/filter/DateRangeDropdown'

const options: Array<String> = ['Tuần này', 'Tuần trước', 'Tháng này', 'Tháng trước', 'Năm này', 'Năm trước', 'Toàn bộ']

type Props = {
  setTimeRange: React.Dispatch<React.SetStateAction<String>>
}


export default function TimeDropdown({ setTimeRange }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setvalue] = useState<String>(options[6])
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (value: String) => {
    setvalue(value)
    setOpen(false)
  }

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    setTimeRange(value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  const prevOpen = useRef(open)

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <Grid>
      <Button
        ref={anchorRef}
        className='p-3 px-5'
        variant='outlined'
        aria-haspopup='true'
        onClick={handleToggle}
        id='composition-button'
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'composition-menu' : undefined}
      >
        <Grid item className='items-center row flex-row flex'>
          <i className='tabler-calendar-month' />
          <p className='mx-3'>{value}</p>
          <i className='tabler-caret-down' />
        </Grid>
      </Button>
      <Popper
        transition
        open={open}
        disablePortal
        role={undefined}
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='z-[var(--mui-zIndex-modal)]'
        popperOptions={{
          modifiers: [
            {
              name: 'flip',
              options: {
                enabled: true,
                boundary: 'window'
              }
            }
          ]
        }}
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
          >
            <Paper className='shadow-lg mbs-0.5'>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList
                  autoFocusItem={open}
                  id='composition-menu'
                  onKeyDown={handleListKeyDown}
                  className='flex flex-col gap-0.5 pli-2 p-2'
                >
                  {options.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        handleClose(options[index])
                      }}
                    >
                      {item}
                    </MenuItem>
                  ))}
                  <DateRangeDropdown setTimeDropdown={setOpen} setValueShowSelect={setvalue} />
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Grid>
  )
}
