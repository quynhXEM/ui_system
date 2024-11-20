// MUI Imports
import { Grid, Card, Typography, CardContent } from '@mui/material'

import { useSession } from 'next-auth/react'

import type { ProfileTeamsType, ProfileCommonType, ProfileTabType } from '@/types/pages/profileTypes'
import { useDictionary } from '@/contexts/dictionaryContext'

const renderList = (list: ProfileCommonType[], dictionary: any) => {
  return (
    list.length > 0 &&
    list.map((item, index) => {
      return (
        <div key={index} className='flex items-center gap-2'>
          <i className={item.icon} />
          <div className='flex items-center flex-wrap gap-2'>
            <Typography className='font-medium'>{dictionary[item.property]}:</Typography>
            <Typography> {item.value}</Typography>
          </div>
        </div>
      )
    })
  )
}

const renderTeams = (teams: ProfileTeamsType[]) => {
  return (
    teams.length > 0 &&
    teams.map((item, index) => {
      return (
        <div key={index} className='flex items-center flex-wrap gap-2'>
          <Typography className='font-medium'>
            {item.property.charAt(0).toUpperCase() + item.property.slice(1)}
          </Typography>
          <Typography>{item.value}</Typography>
        </div>
      )
    })
  )
}

const AboutOverview = ({ data }: { data?: ProfileTabType }) => {
  const { dictionary } = useDictionary()
  const { data: session } = useSession()

  const userData = {
    about: [
      { property: 'fullname', value: session?.user?.full_name, icon: 'tabler-user' },
      { property: 'state', value: 'Active', icon: 'tabler-check' },
      { property: 'role', value: 'Developer', icon: 'tabler-crown' },
      { property: 'country', value: 'Viet Nam', icon: 'tabler-flag' },
      { property: 'language', value: 'English', icon: 'tabler-language' }
    ],
    contacts: [
      { property: 'phone_number', value: session?.user?.phone, icon: 'tabler-phone-call' },
      { property: 'skype', value: 'john.doe', icon: 'tabler-messages' },
      { property: 'email', value: session?.user?.email, icon: 'tabler-mail' }
    ]
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                {dictionary.about}
              </Typography>
              {data?.about && renderList(userData?.about, dictionary)}
            </div>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                {dictionary.contacts}
              </Typography>
              {data?.contacts && renderList(userData?.contacts, dictionary)}
            </div>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                {dictionary.teams}
              </Typography>
              {data?.teams && renderTeams(data?.teams)}
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                {dictionary.overview}
              </Typography>
              {data?.overview && renderList(data?.overview, dictionary)}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
