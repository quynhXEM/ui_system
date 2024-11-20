import React, { useEffect, useRef, useState } from 'react'


import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { Grid } from '@mui/material'


import { FilterTeamType } from '@/types/filterTypes'

export default function FilterTeam({ setFilter }: { setFilter: React.Dispatch<React.SetStateAction<FilterTeamType>> }) {
  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const options: Array<any> = [
    {
      value: 'Theo Thành viên',
      func: () => {
        filterMenbers()
      }
    },
    {
      value: 'Theo Ngày tạo',
      func: () => {
        filterDateCreate()
      }
    }
  ]

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const filterDateCreate = () => {
    console.log('filterMenbers')
  }

  const filterMenbers = () => {
    console.log('filterMenbers')
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
      <i className='tabler-filter mx-3' id='composition-button' ref={anchorRef} onClick={handleToggle} />
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
                <MenuList autoFocusItem={open} id='composition-menu' className='flex flex-col gap-0.5 pli-2 p-2'>
                  {options.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        item.func()
                      }}
                    >
                      {item.value}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Grid>
  )
}
