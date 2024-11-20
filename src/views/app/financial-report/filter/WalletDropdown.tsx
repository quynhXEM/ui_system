import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { Grid } from '@mui/material'

type Wallet = {
  icon: string
  title: String
  cost: Number
}


export default function WalletDropdown() {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<Wallet>(data[data.length - 1])
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)

  const WalletRender = (item: Wallet, index: number) => {
    const handlerClickMenu = () => {
      setValue(item)
      setOpen(!open)
    }


    return (
      <MenuItem key={index} onClick={handlerClickMenu}>
        <Grid className='flex justify-between flex-row ' style={{ width: '100%' }}>
          <div className='flex items-start'>
            <i className={item?.icon} />
            <p className='ml-2'>{item?.title}</p>
          </div>
          <div className='flex'>
            <h3 className='ml-4'>{item?.cost.toString()}</h3>
          </div>
        </Grid>
      </MenuItem>
    )
  }

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <Button
        ref={anchorRef}
        variant='outlined'
        aria-haspopup='true'
        onClick={handleToggle}
        id='composition-button'
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'composition-menu' : undefined}
      >
        <div className='flex flex-row row justify-center items-center'>
          <i className={value?.icon} />
          <p className='ml-2'>{value?.title}</p>
          <p
            className='ml-2 p-2 rounded-xl text-white'
            style={{ backgroundColor: Number(value?.cost) <= 0 ? 'red' : 'green' }}
          >
            {value?.cost.toString()}
          </p>
          <i className='tabler-caret-down' />
        </div>
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
            <Paper className='shadow-lg mbs-0.5 p-3'>
              <MenuItem className=''>
                <i className='tabler-wallet' />
                <label>Ví</label>
              </MenuItem>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList
                  autoFocusItem={open}
                  id='composition-menu'
                  onKeyDown={handleListKeyDown}
                  className='flex flex-col gap-0.5 pli-2 p-2'
                >
                  {data.map((item, index) => WalletRender(item, index))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

const data: Array<Wallet> = [
  {
    title: 'Quỹ dự phòng',
    icon: 'tabler-credit-card-refund',
    cost: 1000000
  },
  {
    title: 'Quỹ giáo dục',
    icon: 'tabler-school',
    cost: 1000000
  },
  {
    title: 'Quỹ đầu tư',
    icon: 'tabler-businessplan',
    cost: -1000000
  },
  {
    title: 'Quỹ ăn chơi',
    icon: 'tabler-beach',
    cost: -1000000
  },
  {
    title: 'Quỹ từ thiện',
    icon: 'tabler-heart-handshake',
    cost: 1000000
  },
  {
    title: 'Tài khoản công ty',
    icon: 'tabler-pig-money',
    cost: 1000000
  },
  {
    title: 'VÍ mặt định',
    icon: 'tabler-wallet',
    cost: 1000000
  },
  {
    title: 'Tổng',
    icon: 'tabler-moneybag',
    cost: 1000000
  }
]
