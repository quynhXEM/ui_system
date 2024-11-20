'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Component Imports
import { FormControl, MenuItem, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import { createItem } from '@directus/sdk'

import CustomTextField from '@core/components/mui/TextField'

import { useDirectus } from '@/contexts/directusProvider'
import { useDictionary } from '@/contexts/dictionaryContext'
import { FormatImage } from '@/libs/FormatImage'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import ImageDropZone from '@/components/form/DropZone'

import { TeamStatus } from '@/data/items/team'
import { useCurrentSession } from '@/libs/useCurrentSession'

type TeamCardData = {
  status?: string
  name?: string
  icon?: string
  logo?: string
}

type TeamCardProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: TeamCardData
  onSuccess: Function
}

const initialCardData: TeamCardProps['data'] = {
  status: '',
  name: '',
  icon: '',
  logo: ''
}

const DialogTeamCard = ({ open, setOpen, data, onSuccess }: TeamCardProps) => {
  const { directusRequest } = useDirectus()
  const { dictionary } = useDictionary()

  // States
  const [teamData, setTeamData] = useState(initialCardData)
  const [icon, setIcon] = useState<File>()
  const [logo, setLogo] = useState<File>()
  const [loading, setLoading] = useState(false)
  // const { session, status } = useCurrentSession()
  const session = null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // FUnction upload new image
    const uploadImage = async (file: any, title: string) => {
      const folder = title === 'logo' ? '2581b425-459d-415a-bed6-a3fda7733426' : '030e3df4-e5c3-4ccc-896e-ab217e15f94b'
      const myHeaders = new Headers()

      myHeaders.append('Authorization', `Bearer ${session?.user?.access_token}`)
      const formdata = new FormData()

      formdata.append('folder', folder)
      formdata.append('[]', file)

      const requestOptions: RequestInit = {
        headers: myHeaders,
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      }

      const resault = await fetch('https://soc.socjsc.com/files', requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)

          return result
        })
        .catch(error => console.error(error))

      if (!resault?.data) {
        return { status: false, data: '' }
      }

      return { status: true, data: resault?.data }
    }

    //Request Add new Team
    const requestAddTeam = async (teamData: any) => {
      if (!teamData.icon || !teamData.logo) {
        toast.warning('Please fill full form !')
        setLoading(false)

        return
      }

      const resault = await directusRequest(createItem('teams', teamData))

      if (resault) {
        localStorage.setItem('teams', JSON.stringify(resault))
        setTeamData(initialCardData)
        onSuccess()
      } else {
        toast.error('Have a problem')
      }

      setLoading(false)
      handleClose()
    }

    //Middleware form data
    if (!icon || !logo || !teamData.name?.trim() || !teamData.status?.trim()) {
      toast.warning('Please fill full form !')
      setLoading(false)

      return
    }

    const iconresault = await uploadImage(icon, 'icon')
    const logoresault = await uploadImage(logo, 'logo')

    if (!iconresault.status || !logoresault.status || !iconresault.data || !logoresault.data) {
      toast.warning(iconresault.data?.message)
      setLoading(false)

      return
    } else {
      setTeamData({ ...teamData, icon: iconresault.data.id, logo: logoresault.data.id })
      requestAddTeam({ ...teamData, icon: iconresault.data.id, logo: logoresault.data.id })
    }
  }

  const setImage = async (e: any, setUpdate: Function) => {
    const resault = await FormatImage(e[0])

    if (resault.data != null) {
      setUpdate(resault.data)
    } else {
      toast.warning(dictionary[resault.err as keyof typeof dictionary])
    }
  }

  const handleClose = () => {
    if (!loading) {
      setOpen(false)
      setTeamData(initialCardData)
    }

    return
  }

  useEffect(() => {
    setTeamData(data ?? initialCardData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => handleClose()} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 sm:pb-16 sm:pbe-6 sm:pli-16'>
        {dictionary.create_team}
      </DialogTitle>
      <div className='overflow-y-auto '>
        <FormControl onSubmit={e => e.preventDefault()}>
          <DialogContent className='overflow-hidden pbs-0 p-6 sm:pli-16'>
            <Grid container spacing={4}>
              <Grid item xs={6} className='text-center '>
                <p className='text-lg font-semibold'>{dictionary.logo_team}</p>
                <div style={{ borderRadius: logo ? '0' : '20', borderWidth: 1 }} className='h-max-40 '>
                  <ImageDropZone
                    onSelected={(e: any) => {
                      setImage(e, setLogo)
                    }}
                    size={1}
                  />
                </div>
              </Grid>
              <Grid item xs={6} className='text-center'>
                <p className='text-lg font-semibold'>{dictionary.icon_team}</p>
                <div style={{ borderRadius: icon ? '0' : '20', borderWidth: 1 }} className='h-max-20 '>
                  <ImageDropZone
                    size={1}
                    onSelected={async (e: any) => {
                      setImage(e, setIcon)
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <p className='text-lg font-semibold'>{dictionary.name_team}</p>
                <CustomTextField
                  fullWidth
                  onChange={(e: any) => {
                    setTeamData({ ...teamData, name: e.target.value as string })
                  }}
                >
                  {teamData.name}
                </CustomTextField>
              </Grid>
              <Grid item xs={12}>
                <p className='text-lg font-semibold'>{dictionary.status}</p>
                <CustomTextField
                  select
                  fullWidth
                  value={teamData.status}
                  onChange={(e: any) => setTeamData({ ...teamData, status: e.target.value as string })}
                >
                  {TeamStatus.map((status, index) => (
                    <MenuItem key={index} value={status.label.toLowerCase().replace(/\s+/g, '-')}>
                      <div className='flex flex-row gap-2 items-center'>
                        <div className='h-2 w-2 rounded-full' style={{ backgroundColor: status.color }} />
                        <Typography>{dictionary[status.label as keyof typeof dictionary]}</Typography>
                      </div>
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className='justify-between pbs-0 p-6 sm:pbe-16 sm:pli-16'>
            <Button variant='tonal' type='reset' color='secondary' onClick={handleClose}>
              {dictionary.cancel}
            </Button>
            <Button variant='contained' disabled={loading} type='submit' onClick={handleSubmit}>
              {dictionary.submit}
            </Button>
          </DialogActions>
        </FormControl>
      </div>
    </Dialog>
  )
}

export default DialogTeamCard
