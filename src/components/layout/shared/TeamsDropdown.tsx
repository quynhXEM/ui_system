'use client'
import React, { useEffect, useRef, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import MenuItem from '@mui/material/MenuItem'
import { Button, Menu, Typography } from '@mui/material'
import { readItems } from '@directus/sdk'

import { useDirectus } from '@/contexts/directusProvider'
import { TeamStatus } from '@/data/items/team'
import { useDictionary } from '@/contexts/dictionaryContext'
import { useTeams } from '@/contexts/teamsContext'

const TeamsDropdown = () => {
  // const { directusRequest } = useDirectus()
  const { dictionary } = useDictionary()
  const { teams, updateTeams } = useTeams()
  // const router = useRouter()
  // const { lang } = useParams()

  const [teamslist, setTeamsList] = useState([]) // Thay thế `any` bằng kiểu cụ thể hơn nếu cần

  const [anchorEl, setAnchorEl] = useState()
  const open = Boolean(anchorEl)

  const handleClick = (event : any) => {
    // if (Array.isArray(teamslist) && teamslist.length > 0) {
    //   setAnchorEl(event.currentTarget)
    // } else {
    //   router.push(`/${lang}/teams`)
    // }
  }

  const handleClose = () => {
    // setAnchorEl(null)
  }

  const handleModeSwitch = (item : any) => {
    // Thay thế `any` bằng kiểu cụ thể hơn
    // updateTeams(item)
    // handleClose()
  }

  const handleGetTeam = async () => {
    // try {
    //   const result = await directusRequest(readItems('teams', { fields: ['id', 'name', 'logo', 'status'] }))

    //   setTeamsList(result)

    //   if (result.length > 0) {
    //     updateTeams(result[0]) // Cập nhật teams từ danh sách
    //   }
    // } catch (err) {
    //   console.log(err)
    // }
  }

  useEffect(() => {
    // handleGetTeam()
    // window.addEventListener('storage', handleGetTeam)

    // return () => {
    //   window.removeEventListener('storage', handleGetTeam)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Button
        className='text-textPrimary'
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {teams ? (
          <div className='row flex-row flex'>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${teams?.logo || 'c4513ff9-ac21-4bce-926f-4bf7e42798f8'}/fit=contain&width=10&height=10&quality=25`}
              style={{ width: 20, height: 20, borderRadius: 5 }}
            />
            <p className='text-lg font-semibold mx-2 hidden sm:block'>{teams?.name}</p>
            <i className='tabler-caret-down hidden sm:block' />
          </div>
        ) : (
          <div>
            <p className='text-lg font-semibold mx-2'>{dictionary.dont_select_team}</p>
          </div>
        )}
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {teamslist.map(item => (
          <MenuItem key={item.id} className='gap-3' onClick={() => handleModeSwitch(item)}>
            <div className='flex flex-row gap-2 items-center'>
              <div
                className='h-2 w-2 rounded-full'
                style={{ backgroundColor: TeamStatus.find(el => el.label === item.status)?.chipColor }}
              />
              <Typography className='text-lg font-semibold'>{item.name}</Typography>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default TeamsDropdown
