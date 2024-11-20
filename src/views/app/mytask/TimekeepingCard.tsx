import React, { useEffect, useState } from 'react'

import { Avatar, Button, Collapse, Paper, Typography } from '@mui/material'

import { useWindowSize } from 'react-use'

import { readItems } from '@directus/sdk'

import RadialBarChart from './RadialBarChart'
import { useSettings } from '@/@core/hooks/useSettings'

import { useDictionary } from '@/contexts/dictionaryContext'

import { useDirectus } from '@/contexts/directusProvider'
import { ProjectItemType } from '@/types/projectTypes'
import RenderItemProject from './renderItem/RenderItemProject'



const TimekeepingCard = () => {
  const { dictionary } = useDictionary()
  const { settings } = useSettings()
  const { directusRequest } = useDirectus()
  const [showImageReminder, setShowImageReminder] = useState<boolean>(false)
  const [showProject, setShowProject] = useState<boolean>(false)
  const [showWorkingHours, setShowWorkingHours] = useState<boolean>(false)

  //API
  const [dataProject, setDataProject] = useState<ProjectItemType[]>([])

  const onClickShowReminder = () => {
    setShowProject(false)
    setShowWorkingHours(false)
    setShowImageReminder(!showImageReminder)
  }

  const onClickShowProject = () => {
    setShowImageReminder(false)
    setShowWorkingHours(false)
    setShowProject(!showProject)
  }

  const onClickShowWorkingHours = () => {
    setShowProject(false)
    setShowImageReminder(false)
    setShowWorkingHours(!showWorkingHours)
  }

  const getProject = async () => {
    try {
      const project = await directusRequest(readItems('projects', {
        fields: [
          'id',
          'date_created',
          'name',
          'status',
          'team_id.members.user_id.id',
          'team_id.members.user_id.username',
          'team_id.members.user_id.avatar',
          'team_id.members.user_id.email',

          // thêm các trường khác mà bạn muốn lấy ở đây
        ]
      }));

      if (project && Array.isArray(project)) {
        setDataProject(project)
      }
    } catch (error) {
      console.log("error getProject", error);
    }
  }

  useEffect(() => {
    getProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='mt-4 flex-1'>
      <Paper
        className={`${settings.skin === 'bordered' ? 'border border-gray-300 shadow-none' : 'shadow-sm'
          } flex flex-row justify-start py-4 pl-3 w-full border-b-2 border-gray-200 cursor-pointer`}
        onClick={onClickShowReminder}
      >
        <i className='tabler-circle-check mr-2 text-blue-600' />
        <span className='font-semibold text-blue-600'>{dictionary.reminder}</span>
      </Paper>
      <Collapse in={showImageReminder} timeout={700}>
        <div className=''>
          <img
            src='https://system.socjsc.com/upload/slogan/279577810_365878295571538_3797200468185830547_n.jpg'
          />
        </div>
      </Collapse>
      <Paper
        onClick={onClickShowProject}
        className={`${settings.skin === 'bordered' ? 'border border-gray-300 shadow-none' : 'shadow-sm'
          } flex flex-row justify-start py-4 pl-3 w-full border-b-2 border-gray-200 cursor-pointer`}
      >
        <i className='tabler-user-check mr-2 text-blue-600' />
        <span className='font-semibold text-blue-600'>{dictionary.project}</span>
      </Paper>
      <Collapse in={showProject} timeout={700}>
        <div className='p-2'>
          {
            dataProject?.length > 0 ?
              (
                dataProject.map((item) => (
                  <RenderItemProject
                    key={item.id}
                    item={item}
                  />
                ))
              )
              :
              (
                <div className='py-3'>
                  <span>{dictionary.you_do_not_have_any_projects_yet}</span>
                </div>
              )
          }
        </div>
      </Collapse >
      <Paper
        onClick={onClickShowWorkingHours}
        className={`${settings.skin === 'bordered' ? 'border border-gray-300 shadow-none' : 'shadow-sm'
          } flex flex-row justify-start py-4 pl-3 w-full border-b-2 border-gray-200 cursor-pointer`}

      // style={{ backgroundColor: '#EDF0F7' }}
      >
        <i className='tabler-report mr-2 text-blue-600' />
        <span className='font-semibold text-blue-600'>{dictionary.timekeeping}</span>
      </Paper>
      <Collapse in={showWorkingHours} timeout={700}>
        <div>
          {/* <RadialBarChart /> */}
          <div className='flex justify-center'>
            <span className='text-sm text-red-600 mr-1'>83.7</span>
            <span>/</span>
            <span className='text-sm ml-1'>184 {dictionary.hours}</span>
          </div>
          <div className='flex justify-between py-1 border-b-2 border-gray-300'>
            <span className='text-base font-bold'>{dictionary.category}</span>
            <span className='text-base font-bold'>VND</span>
          </div>
          <div className='flex justify-between items-center my-2 '>
            <div className='flex flex-row items-center'>
              <i className='tabler-bolt text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.mission}</span>
            </div>
            <span className='text-base font-normal'>3,235,234</span>
          </div>
          <div className='flex justify-between items-center my-2 '>
            <div className='flex flex-row items-center'>
              <i className='tabler-rocket text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.overtime}</span>
            </div>
            <span className='text-base font-normal'>3,235,234</span>
          </div>
          <div className='flex justify-between items-center my-2 '>
            <div className='flex flex-row items-center'>
              <i className='tabler-flame text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.reward_and_punishment}</span>
            </div>
            <span className='text-base font-normal'>3,235,234</span>
          </div>
          <div className='flex justify-between items-center my-2 '>
            <div className='flex flex-row items-center'>
              <i className='tabler-propeller text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.social_insurance}</span>
            </div>
            <span className='text-base font-normal'>3,235,234</span>
          </div>
          <div className='flex justify-between items-center my-2 '>
            <div className='flex flex-row items-center'>
              <i className='tabler-briefcase text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.diligence}</span>
            </div>
            <span className='text-base font-normal'>3,235,234</span>
          </div>
          <div className='flex justify-between items-center my-2 border-b-2 border-gray-300 pb-1'>
            <div className='flex flex-row items-center'>
              <i className='tabler-medal-2 text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.rating}</span>
            </div>
            <span className='text-base font-normal'>8</span>
          </div>
          <div className='flex justify-between items-center my-2'>
            <div className='flex flex-row items-center'>
              <i className='tabler-plus text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.total}</span>
            </div>
            <span className='text-base font-normal'>3.235.234</span>
          </div>
          <div className='flex justify-between items-center my-2'>
            <div className='flex flex-row items-center'>
              <i className='tabler-coin text-xl mr-1' />
              <span className='text-base font-normal'>{dictionary.real}</span>
            </div>
            <span className='text-base font-normal'>3.235.234</span>
          </div>
          <div className='flex flex-row items-center justify-center mt-2'>
            <i className='tabler-clock text-xl mr-1' />
            <span className='text-base font-normal text-blue-900'>{dictionary.view_history}</span>
          </div>
        </div>
      </Collapse>
    </div >
  )
}

export default TimekeepingCard
