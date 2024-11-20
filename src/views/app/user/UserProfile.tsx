'use client'

import { ReactElement, SyntheticEvent, useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { readItems } from '@directus/sdk'

import { Grid, Tab } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'

import { useDirectus } from '@/contexts/directusProvider'

import UserProfileHeader from './UserProfileHeader'
import CustomTabList from '@core/components/mui/TabList'

import { db as data } from '@/fake-db/userProfile'
import { useDictionary } from '@/contexts/dictionaryContext'

type TabLabel = 'profile' | 'teams' | 'projects' | 'connections'

const ProfileTab = dynamic(() => import('./profile/ProfileTab'))
const TeamsTab = dynamic(() => import('./teams/TeamsTab'))
const ProjectsTab = dynamic(() => import('./projects/ProjectsTab'))
const ConnectionsTab = dynamic(() => import('./connections/ConnectionsTab'))

const tabList = [
  {
    label: 'profile',
    icon: 'tabler-user-check'
  },
  {
    label: 'teams',
    icon: 'tabler-users'
  },
  {
    label: 'projects',
    icon: 'tabler-layout-grid'
  },
  {
    label: 'connections',
    icon: 'tabler-link'
  }
]

const tabContentList = (): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} />,
  teams: <TeamsTab data={data?.users.teams} />,
  projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
})

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<TabLabel>('profile')
  const { dictionary } = useDictionary()

  const handleChange = (event: SyntheticEvent, value: TabLabel) => {
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12} className='flex flex-col gap-6'>
          <TabContext value={activeTab}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              {tabList.map(tab => (
                <Tab
                  key={tab.label}
                  label={
                    <div className='flex items-center gap-1.5 capitalize'>
                      <i className={`${tab.icon} text-lg`} />
                      {dictionary[tab.label as keyof typeof dictionary]}
                    </div>
                  }
                  value={tab.label}
                />
              ))}
            </CustomTabList>

            <TabPanel value={activeTab} className='p-0'>
              {tabContentList()[activeTab]}
            </TabPanel>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}

export default UserProfile
