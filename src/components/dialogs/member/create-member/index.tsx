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

import { useDirectus } from '@/contexts/directusProvider'
import { useDictionary } from '@/contexts/dictionaryContext'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import MemberForm, { MemberFormData, MemberFormHandle } from '@/components/members/MemberForm'

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

const DialogCreateMember = ({ open, setOpen, data, onSuccess }: TeamCardProps) => {
  const { directusRequest } = useDirectus()
  const { dictionary } = useDictionary()
  const memberFormRef = useRef<MemberFormHandle>(null)

  // States
  const [teamData, setTeamData] = useState(initialCardData)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  }

  const onPressSubmit = async () => {
    if (memberFormRef?.current?.isDirty) {
      memberFormRef?.current?.submit()
    }
  }

  const onSubmit = async (values: MemberFormData) => {
    console.log(values)
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
        {dictionary.add_member}
      </DialogTitle>
      <div className='overflow-y-auto '>
        <DialogContent className='overflow-hidden pbs-0 p-6 sm:pli-16'>
          <MemberForm ref={memberFormRef} onSubmit={onSubmit} />
        </DialogContent>
        <DialogActions className='justify-between pbs-0 p-6 sm:pbe-16 sm:pli-16'>
          <Button variant='tonal' type='reset' color='secondary' onClick={handleClose}>
            {dictionary.cancel}
          </Button>
          <Button variant='contained' type='submit' onClick={onPressSubmit}>
            {dictionary.submit}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default DialogCreateMember

const statusoption: Array<String> = ['pending', 'active', 'inactive', 'suspended', 'archived']
