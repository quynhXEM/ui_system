'use client'

import { Card, CardContent, CardHeader } from '@mui/material'
import { ToastContainer } from 'react-toastify'

import FormChangePassword from '@/views/app/change-password/components/FormChangePassword'
import { useDictionary } from '@/contexts/dictionaryContext'

const PasswordChangePage = () => {
  const {dictionary} = useDictionary()

  return (
    <>
      <Card className='p-2'>
        <ToastContainer />
        <CardHeader
          titleTypographyProps={{ color: 'red' }}
          title={dictionary.warning_change_pass}
        />
        <CardContent>
          <FormChangePassword />
        </CardContent>
      </Card>
    </>
  )
}

export default PasswordChangePage
