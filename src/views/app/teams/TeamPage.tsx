'use client'

import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import { toast, ToastContainer } from 'react-toastify'

import { readItems } from '@directus/sdk'

import CustomTextField from '@/@core/components/mui/TextField'
import { TeamType } from '@/types/requestTypes'
import TeamCard from '@/views/app/teams/components/TeamCard'

import { FilterTeamType } from '@/types/filterTypes'
import FilterTeam from '@/views/app/teams/components/filter/FilterTeam'
import { useDirectus } from '@/contexts/directusProvider'

import { useDictionary } from '@/contexts/dictionaryContext'
import DialogTeamCard from '@/components/dialogs/team/add-team'

const TeamPage = () => {
  const { directusRequest } = useDirectus()
  const { dictionary } = useDictionary()
  const [data, setdata] = useState<Array<any>>()
  const [open, setOpen] = useState(false)

  const [filter, setFilter] = useState<FilterTeamType>({
    keyword: '',
    options: null
  })

  useEffect(() => {
    requestTeamList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSuccess = () => {
    toast.success(dictionary.add_successful)
    requestTeamList()
  }

  const requestTeamList = async () => {
    try {
      await directusRequest(readItems('teams'))
        .then(resault => setdata(resault))
        .catch(err => toast.error(err?.errors?.messages?.[0]))
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilter = (list: Array<TeamType> | undefined) => {
    if (!filter.keyword) return data
    const datafilter = list?.filter(item => item.name.toLowerCase().includes(filter.keyword.toLowerCase().trim()))

    return datafilter
  }

  const handleOpenAddTeams = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }


  return (
    <>
      <ToastContainer />
      <Card className='flex flex-row justify-between items-center p-3 mb-4'>
        <Grid className='flex flex-row justify-start items-center w-full'>
          <CustomTextField
            fullWidth
            value={filter?.keyword}
            onChange={(e: any) => setFilter({ ...filter, keyword: e.target.value })}
          />
        </Grid>
        <Grid className='flex flex-row justify-end items-center'>
          <FilterTeam setFilter={setFilter} />
          <Button variant='contained' onClick={handleOpenAddTeams}>{dictionary.create}</Button>
          <DialogTeamCard onSuccess={onSuccess} open={open} setOpen={onClose} />
        </Grid>
      </Card>
      <Grid container spacing={3}>
        {handleFilter(data) && <TeamCard data={handleFilter(data)} />}
        {!handleFilter(data)?.length && <div className='flex content-center items-center justify-center w-full h-full'>
          <p>{dictionary.no_data}</p>
        </div>}
      </Grid>
    </>
  )
}

export default TeamPage
