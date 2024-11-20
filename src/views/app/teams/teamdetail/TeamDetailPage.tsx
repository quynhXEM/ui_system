'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { deleteItem, readItem, updateItem } from '@directus/sdk'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { toast, ToastContainer } from 'react-toastify'

import { useSession } from 'next-auth/react'

import { useDirectus } from '@/contexts/directusProvider'

import CustomTextField from '@/@core/components/mui/TextField'

import { FormatImage, ReadImage } from '@/libs/FormatImage'
import { UploadImage } from '@/utils/UploadImage'

import { useDictionary } from '@/contexts/dictionaryContext'
import DialogButton from '@/components/dialogs/DialogButton'
import RemoveTeam from '@/components/dialogs/team/remove-team'
import { TeamStatus } from '@/data/items/team'
import InviteForm from '@/components/teams/InviteForm'
import MemberList from '@/components/teams/MemberList'
import ProjectList from '@/components/teams/ProjectList'


export default function TeamDetailPage(params: { id: string }) {
  // Hook
  const router = useRouter()
  const { directusRequest } = useDirectus()
  const { dictionary } = useDictionary()
  const auth = useSession().data?.user

  // State
  const [team, setTeam] = useState<any>()
  const [teamupdate, setTeamupdate] = useState<any>({})
  const [updateLogo, setUpdateLogo] = useState()
  const [updateIcon, setUpdateIcon] = useState()
  const [permisstion, setPermisstion] = useState(true)

  const onReload = () => {
    toast.success('Successful !!')
    router.push(`/teams`)
  }

  const onSuccess = () => {
    handleGetTeam()
  }

  const handleDelete = async () => {
    await directusRequest(deleteItem('teams', params?.id))
      .then(respone => {
        localStorage.removeItem('teams')
        onReload()
      })
      .catch(err => {
        console.log(err)
        toast.error(err.errors[0].message)
      })
  }

  const handleUpdate = async () => {
    if (teamupdate && 'name' in teamupdate) {
      const name = teamupdate.name

      if (!name.trim()) {
        return
      }
    }

    const uploadImageLogo = !updateLogo
      ? null
      : await (
        await UploadImage(teamupdate.logo, 'logo', auth?.access_token)
      ).data?.id

    const uploadImageIcon = !updateIcon
      ? null
      : await (
        await UploadImage(teamupdate.icon, 'icon', auth?.access_token)
      ).data?.id

    const body = {
      ...teamupdate,
      ...(uploadImageLogo !== null ? { logo: uploadImageLogo } : {}),
      ...(uploadImageIcon !== null ? { icon: uploadImageIcon } : {})
    }

    await directusRequest(updateItem('teams', params?.id, body))
      .then(respone => {
        toast.success('Successful !!')
        setTeamupdate({})
        handleGetTeam()
      })
      .catch(err => {
        console.log(err)
        toast.error(err.errors[0].message)
      })
  }

  const handleGetTeam = async () => {
    await directusRequest(
      readItem('teams', params?.id, {
        fields: ['id', 'status', 'logo', 'icon', 'name', 'members.*', 'projects.*', 'members.user_id.*']
      })
    )
      .then(resault => {
        setTeam(resault)
      })
      .catch(err => {
        console.log(err)
        toast.error(err?.errors[0].message)
        router.push(`/teams`)
      })
  }

  useEffect(() => {
    team?.members?.map((mem: any) => {
      if (mem?.user_id?.id === auth?.id && mem?.role === 'owner') {
        setPermisstion(false)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team])

  useEffect(() => {
    handleGetTeam()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusTeam = (status: string) => {
    let resault = {}

    TeamStatus.map(item => {
      if (status === item.label) {
        resault = item
      }
    })

    return resault
  }

  const setImage = async (e: any, key: string) => {

    const resault = await FormatImage(e)

    if (resault.data !== null) {
      key === 'logo' ? setTeamupdate({ ...teamupdate, logo: resault.data }) :
        setTeamupdate({ ...teamupdate, icon: resault.data })
      key === 'logo' ? ReadImage(resault.data, setUpdateLogo) : ReadImage(resault.data, setUpdateIcon)
    } else {
      toast.warning(dictionary[resault.err as keyof typeof dictionary])
    }

  }

  return (
    <>
      <ToastContainer />
      {team ? (
        <div>
          <Grid container className='row flex-row flex items-center justify-between w-full'>
            <Grid item className='flex flex-row row justify-start items-center'>
              <p className='text-2xl font-bold mx-5'>{team?.name}</p>
              <div className='flex row flex-row justify-center items-center'>
                <div className='flex flex-row gap-2 items-center'>
                  <div className='h-2 w-2 rounded-full' style={{ backgroundColor: statusTeam(team?.status)?.color }} />
                  <Typography>{dictionary[statusTeam(team?.status)?.label as keyof typeof dictionary]}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item>
              <Button variant='outlined' disabled={permisstion} color='primary' onClick={handleUpdate}>
                {dictionary.update}
              </Button>
              <DialogButton
                Dialog={RemoveTeam}
                buttonProps={{
                  disabled: permisstion,
                  variant: 'outlined',
                  color: 'error',
                  className: 'mx-3',
                  children: <p>{dictionary.delete}</p>
                }}
                dialogProps={{
                  onSuccess: onReload,
                  onFunt: handleDelete
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={5} className='pt-5'>
            <Grid item xs={12} sm={6}>
              <Card className='min-h-96 justify-evenly'>
                <CardContent className='flex flex-col col-auto justify-evenly items-center'>
                  <div className='flex flex-row row justify-evenly items-center w-full'>
                    <div className='flex flex-row row'>
                      <label htmlFor='logo' className='text-center'>
                        <img
                          title='Click to change LOGO'
                          style={{ width: 100, height: 100 }}
                          className='rounded-xl transition-opacity duration-300 hover:opacity-50'
                          src={
                            updateLogo || `${process.env.NEXT_PUBLIC_API_URL}/assets/${team.logo}?fit=contain&width=100&height=100`
                          }
                        />
                        <input
                          alt='Logo'
                          id='logo'
                          hidden
                          type='file'
                          onChange={(e: any) => {
                            setImage(e.target.files[0], 'logo')
                          }}
                        />
                      </label>
                    </div>

                    <label htmlFor='icon' className='text-center '>
                      <img
                        alt='Icon'
                        title='Click to change ICON'
                        style={{ width: 50, height: 50 }}
                        className='rounded-xl transition-opacity duration-300 hover:opacity-50'
                        src={updateIcon || `${process.env.NEXT_PUBLIC_API_URL}/assets/${team.icon}?fit=contain&width=50&height=50`}
                      />
                      <input
                        id='icon'
                        hidden
                        type='file'
                        onChange={async (e: any) => {
                          setImage(e.target.files[0], 'icon')
                        }}
                      />
                    </label>
                  </div>
                  <CustomTextField
                    fullWidth
                    className='mt-3'
                    disabled={permisstion}
                    label={dictionary.name}
                    value={teamupdate?.name || ''}
                    onChange={(e: any) => {
                      setTeamupdate({ ...teamupdate, name: e.target.value as string })
                    }}
                  />
                  <CustomTextField
                    select
                    className='mt-3'
                    fullWidth
                    disabled={permisstion}
                    label={dictionary.status}
                    value={teamupdate?.status || ''}
                    onChange={(e: any) => {
                      setTeamupdate({ ...teamupdate, status: e.target.value as string })
                    }}
                  >
                    {TeamStatus.map((status, index) => (
                      <MenuItem key={status.label} value={status.label}>
                        <div className='flex flex-row gap-2 items-center'>
                          <div className='h-2 w-2 rounded-full' style={{ backgroundColor: status.color }} />
                          <Typography>{dictionary[status.label as keyof typeof dictionary]}</Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InviteForm />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MemberList team={team} onSuccess={onSuccess} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProjectList team={team} onSuccess={onSuccess} />
            </Grid>
          </Grid>
        </div>
      ) : (
        <div className='flex content-center items-center justify-center w-full h-full'>
          <CircularProgress />
        </div>
      )}
    </>
  )
}
