'use client'

import { useEffect, useRef, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Button, Card, CardContent } from '@mui/material'

import { readItem, updateItem } from '@directus/sdk'

import { useDictionary } from '@/contexts/dictionaryContext'
import { useDirectus } from '@/contexts/directusProvider'
import ProjectForm, { ProjectFormData, ProjectFormHandle } from '@/components/projects/ProjectForm'
import CustomDialog, { CustomDialogData } from '@/components/CustomDialog'

const ProjectDetail = () => {
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const { id, lang: locale } = useParams()
  const router = useRouter()
  const projectFormRef = useRef<ProjectFormHandle>(null)
  const [data, setData] = useState<ProjectFormData | null>()

  const [dialogData, setDialogData] = useState<CustomDialogData>({
    isOpen: false,
    title: '',
    contentText: '',
    actions: []
  })

  const onCloseDialog = () => {
    setDialogData({
      isOpen: false,
      title: '',
      contentText: '',
      actions: []
    })
  }

  useEffect(() => {
    getProjectData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProjectData = async () => {
    const projData = await directusRequest(readItem('projects', id))

    if (projData) {
      setData(projData)
    }
  }

  const onPressBack = () => {
    if (projectFormRef?.current?.isDirty) {
      setDialogData({
        isOpen: true,
        title: dictionary.edit_project,
        contentText: dictionary.discard_all_your_change,
        actions: [
          {
            label: dictionary.stay_here,
            buttonProps: {
              onClick: onCloseDialog,
              color: 'secondary'
            }
          },
          {
            label: dictionary.go_back,
            buttonProps: {
              onClick: () => {
                onCloseDialog()
                router.back()
              }
            }
          }
        ]
      })
    } else {
      router.back()
    }
  }

  const onPressSubmit = async () => {
    if (projectFormRef?.current?.isDirty) {
      projectFormRef?.current?.submit()
    }
  }

  const onSubmit = async (values: ProjectFormData) => {
    try {
      const dirtyFields = projectFormRef?.current?.getDirtyFields()
      const changeValues: any = {}

      // Get changed fields
      for (const field in dirtyFields) {
        if (dirtyFields[field]) {
          changeValues[field] = values[field]
        }
      }

      if (changeValues?.date_start) {
        changeValues.date_start = changeValues.date_start?.toISOString()
      }

      if (changeValues?.date_end) {
        changeValues.date_end = changeValues.date_end?.toISOString()
      }

      const editProjectAPI = await directusRequest(updateItem('projects', id, changeValues))

      if (editProjectAPI && !editProjectAPI.error) {
        setDialogData({
          isOpen: true,
          title: dictionary.edit_project_success,
          actions: [
            {
              label: dictionary.ok,
              buttonProps: {
                onClick: onCloseDialog
              }
            },
          ]
        })
      }
    } catch (err) {
      console.log('--- ERROR edit Project:', err)
      showError(err?.[0]?.message ?? dictionary.edit_failed + ' ' + dictionary.please_try_again_later)
    }
  }

  const onDiscardChanged = () => {
    setDialogData({
      isOpen: true,
      title: dictionary.edit_project,
      contentText: dictionary.discard_all_your_change,
      actions: [
        {
          label: dictionary.keep_change,
          buttonProps: {
            onClick: onCloseDialog,
            color: 'secondary'
          }
        },
        {
          label: dictionary.discard,
          buttonProps: {
            onClick: () => {
              onCloseDialog()
              projectFormRef?.current?.clearForm()
            }
          }
        }
      ]
    })
  }

  const showError = (err: string) => {
    setDialogData({
      isOpen: true,
      title: dictionary.edit_project_error,
      contentText: err,
      actions: [
        {
          label: dictionary.ok,
          buttonProps: {
            onClick: onCloseDialog
          }
        }
      ]
    })
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex justify-between'>
            <Button variant='contained' color='secondary' onClick={onPressBack}>
              {dictionary.go_back}
            </Button>
            <div className='flex justify-between gap-2'>
              <Button variant='outlined' onClick={onDiscardChanged}>
                {dictionary.discard}
              </Button>
              <Button variant='contained' onClick={onPressSubmit}>
                {dictionary.save}
              </Button>
            </div>
          </div>
          {!!data && <ProjectForm ref={projectFormRef} onSubmit={onSubmit} initFormData={data} currentProject={id as string} />}
        </CardContent>
      </Card>
      <CustomDialog dialogData={dialogData} onCloseDialog={onCloseDialog} />
    </>
  )
}

export default ProjectDetail
