'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { redirect, useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import {
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  Button,
  FormControlLabel,
  styled,
  useTheme,
  useMediaQuery,
  Divider,
  Alert
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty, boolean } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'

import { getLocalizedUrl } from '@/utils/i18n'
import { useDictionary } from '@/contexts/dictionaryContext'
import { useSettings } from '@core/hooks/useSettings'
import { useImageVariant } from '@core/hooks/useImageVariant'
import CustomTextField from '@core/components/mui/TextField'
import DevelopingFeatureDialog from '@components/dialogs/DevelopingFeatureDialog'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@/configs/i18n'
import Logo from '@/components/layout/shared/Logo'
import LanguageDropdown from '@/components/layout/shared/LanguageDropdown'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'required'), email('email_is_invalid')),
  password: pipe(string(), nonEmpty('required')),
  rememberMe: boolean()
})

const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [showDevelopingMessage, setShowDevelopingMessage] = useState(false)
  const [issubmit, setIssubmit] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { dictionary } = useDictionary()
  const { settings } = useSettings()
  const { lang: locale } = useParams()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onLogin: SubmitHandler<FormData> = async (data: FormData) => {
    setIssubmit(true)

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (res && res.ok && res.status === 200) {
        // Vars
        // const redirectURL = searchParams.get('redirectTo') ?? '/'
        router.refresh()
      } else {
        if (res?.error) {
          const error = typeof res.error === 'string' ? { message: [res.error] } : JSON.parse(res.error)

          setIssubmit(false)
          setErrorState(error)
        }
      }
    } catch (error) {

    }

  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-end-6 sm:inline-end-[38px]'>
          <LanguageDropdown />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{dictionary.connect_with_us}</Typography>
            <Typography>{dictionary.please_sign_in}</Typography>
          </div>
          <form
            noValidate
            autoComplete='off'
            action={() => { }}
            onSubmit={handleSubmit(onLogin)}
            className='flex flex-col gap-5'
          >
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='email'
                  autoFocus
                  fullWidth
                  label={dictionary.email}
                  placeholder={dictionary.enter_email}
                  onChange={(e: any) => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...(errors.email && {
                    error: true,
                    helperText: errors?.email?.message && dictionary?.[errors.email.message as keyof typeof dictionary]
                  })}
                  disabled={issubmit}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={dictionary.password}
                  placeholder={dictionary.enter_password}
                  id='outlined-adornment-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={(e: any) => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...(errors.password && {
                    error: true,
                    helperText:
                      errors.password.message && dictionary?.[errors.password.message as keyof typeof dictionary]
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  disabled={issubmit}
                />
              )}
            />
            <div className='flex justify-end items-center gap-x-3 gap-y-1 flex-wrap'>
              {/* <Controller
                name='rememberMe'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        onChange={e => {
                          field.onChange(e.target.checked)
                        }}
                      />
                    }
                    label={dictionary.remember_me}
                  />
                )}
              /> */}
              <Typography
                className='text-end'
                color='primary'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale as Locale)}
              >
                {dictionary.forgot_password}?
              </Typography>
            </div>
            {errorState !== null && (
              <Alert variant='outlined' severity='error'>
                {dictionary?.[errorState.message[0] as keyof typeof dictionary]}
              </Alert>
            )}
            <LoadingButton loading={issubmit} disabled={issubmit} fullWidth variant='contained' type='submit'>
              {dictionary.login}
            </LoadingButton>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>{dictionary.dont_have_account}</Typography>
              <Typography component={Link} color='primary' href={getLocalizedUrl('/register', locale as Locale)}>
                {dictionary.create_an_account}
              </Typography>
            </div>
            <Divider className='gap-2 text-textPrimary'>{dictionary.or}</Divider>
            <div className='flex justify-center items-center gap-1.5'>
              <IconButton className='text-facebook' size='small' onClick={() => setShowDevelopingMessage(true)}>
                <i className='tabler-brand-facebook-filled' />
              </IconButton>
              <IconButton className='text-twitter' size='small' onClick={() => setShowDevelopingMessage(true)}>
                <i className='tabler-brand-twitter-filled' />
              </IconButton>
              <IconButton className='text-textPrimary' size='small' onClick={() => setShowDevelopingMessage(true)}>
                <i className='tabler-brand-github-filled' />
              </IconButton>
              <IconButton className='text-error' size='small' onClick={() => setShowDevelopingMessage(true)}>
                <i className='tabler-brand-google-filled' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
      <DevelopingFeatureDialog isOpen={showDevelopingMessage} onClose={() => setShowDevelopingMessage(false)} />
    </div>
  )
}

export default Login
