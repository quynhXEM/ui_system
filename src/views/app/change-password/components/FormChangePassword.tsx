import { useState } from 'react'

import { Button, Grid, IconButton, InputAdornment } from '@mui/material'

import { toast } from 'react-toastify'

import { passwordReset } from '@directus/sdk'

import Form from '@components/Form'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDictionary } from '@/contexts/dictionaryContext'
import directus from '@/libs/directus'
import { useCurrentSession } from '@/libs/useCurrentSession'

type FormValidate = {
  password: string
  new_pasword: string
  confirm_password: string
}

const initsalState: FormValidate = {
  password: '',
  new_pasword: '',
  confirm_password: ''
}

export default function FormChangePassword() {
  const { dictionary } = useDictionary()
  const [dataForm, setDataForm] = useState<FormValidate>(initsalState)
  const [isPasswordShown, setisPasswordShown] = useState(false)
  const { session, status } = useCurrentSession()

  const validatePass = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[^\s]{8,}$/

    if (!regex.test(pass)) {
      toast.error(dictionary.password_must_be_at_least_8_char)

      return false
    }

    if (dataForm.new_pasword !== dataForm.confirm_password) {
      toast.error(dictionary.password_no_confirm)

      return false
    }

    if (!dataForm.new_pasword || !dataForm.confirm_password || !dataForm.password) {
      toast.warning(dictionary.fill_full_form)

      return false
    }

    return true
  }

  const Submit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (validatePass(dataForm.new_pasword)) {
      console.log(session?.user?.access_token)

      const resetPassword = await directus.request(passwordReset(session?.user?.access_token, dataForm.new_pasword))

      console.log(resetPassword)
    }
  }

  const Reset = () => {
    setDataForm(initsalState)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setDataForm(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <Form onSubmit={Submit}>
      <Grid item className='my-0'>
        <CustomTextField
          fullWidth
          value={dataForm?.password}
          onChange={handleChange}
          name='password'
          type={!isPasswordShown ? 'password' : 'text'}
          label={dictionary.password}
          placeholder={dictionary.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-lock' />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid className='my-5'>
        <CustomTextField
          fullWidth
          value={dataForm?.new_pasword}
          onChange={handleChange}
          name='new_pasword'
          type={!isPasswordShown ? 'password' : 'text'}
          label={dictionary.enter_new_password_to}
          placeholder={dictionary.enter_new_password_to}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-key' />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  edge='end'
                  onClick={() => {
                    setisPasswordShown(!isPasswordShown)
                  }}
                  onMouseDown={e => e.preventDefault()}
                >
                  <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item className='my-0'>
        <CustomTextField
          fullWidth
          value={dataForm?.confirm_password}
          onChange={handleChange}
          name='confirm_password'
          error={dataForm.new_pasword !== dataForm.confirm_password}
          type={!isPasswordShown ? 'password' : 'text'}
          label={dictionary.confirm_pass}
          placeholder={dictionary.confirm_pass}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-key' />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item className='flex flex-row justify-between mt-5'>
        <Button type='reset' variant='tonal' color='secondary' onClick={Reset}>
          {dictionary.clear_form}
        </Button>
        <Button type='submit' variant='contained' onClick={Submit}>
          {dictionary.reset_password}
        </Button>
      </Grid>
    </Form>
  )
}
