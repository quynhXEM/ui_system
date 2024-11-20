'use client'

// React Imports
import React, { useEffect, useRef, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Component Imports
import { toast } from 'react-toastify'

import { createItem } from '@directus/sdk'

import { useDirectus } from '@/contexts/directusProvider'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import ProjectForm, { ProjectFormData, ProjectFormHandle } from '@/components/projects/ProjectForm'
import { useDictionary } from '@/contexts/dictionaryContext'

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

const DialogCreateProject = ({ open, setOpen, data, onSuccess }: TeamCardProps) => {
  const { directusRequest } = useDirectus()
  const { dictionary } = useDictionary()
  const projectFormRef = useRef<ProjectFormHandle>(null)

  const onPressSubmit = async () => {
    if (projectFormRef?.current?.isDirty) {
      projectFormRef?.current?.submit()
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (values: ProjectFormData) => {
    try {
      const {
        team_id,
        name,
        status,
        description,
        date_start: dateStart,
        date_end: dateEnd,
        dependency_project_id,
        tasks
      } = values

      const date_start = dateStart.toISOString()
      const date_end = dateEnd.toISOString()

      if (date_start >= date_end) {
        toast.warning(dictionary.date_start_must_be_earlier_than_date_end)

        return
      }

      const createProject = await directusRequest(
        createItem('projects', {
          team_id,
          name,
          status,
          description,
          date_start,
          date_end,
          dependency_project_id,
          tasks
        })
      )

      if (createProject) {
        toast.success(dictionary.create_project_success)
        setOpen(false)
        onSuccess()
      }
    } catch (error) {
      console.log('--- ERROR create Project:', error)
      toast.error(error?.[0]?.message ?? dictionary.create_failed + ' ' + dictionary.please_try_again_later)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => handleClose()} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 sm:pb-16 sm:pbe-6 sm:pli-16'>
        {dictionary.create_project}
      </DialogTitle>
      <div className='overflow-y-auto '>
        <form onSubmit={e => e.preventDefault()}>
          <DialogContent className='overflow-hidden pbs-0 p-6 sm:pli-16'>
            <ProjectForm ref={projectFormRef} onSubmit={onSubmit} />
          </DialogContent>
          <DialogActions className='justify-between pbs-0 p-6 sm:pbe-16 sm:pli-16'>
            <Button variant='tonal' type='reset' color='secondary' onClick={handleClose}>
              {dictionary.cancel}
            </Button>
            <Button variant='contained' type='submit' onClick={onPressSubmit}>
              {dictionary.submit}
            </Button>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  )
}

export default DialogCreateProject

const statusoption: Array<String> = ['pending', 'active', 'inactive', 'suspended', 'archived']
