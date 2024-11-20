'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import { Typography, useMediaQuery, useTheme, styled, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

// Third-party Imports
import classnames from 'classnames'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { passwordRequest } from '@directus/sdk'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import directus from '@/libs/directus'
import Logo from '@/components/layout/shared/Logo'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'

// Styled Custom Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
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
  email: pipe(string(), minLength(1, 'required'), email('email_is_invalid'))
})

const ForgotPassword = ({ mode }: { mode: SystemMode }) => {
  //States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'

  // Hooks
  const router = useRouter()
  const { dictionary } = useDictionary()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const onResetPassword: SubmitHandler<FormData> = async (data: FormData) => {
    await directus.request(passwordRequest(data.email))
    setShowInfo(true)
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
        <ForgotPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedUrl('/login', locale as Locale)}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-end-6 sm:inline-end-[38px]'>
          <LanguageDropdown />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{dictionary.forgot_password}</Typography>
            <Typography>{dictionary.enter_your_email_and_we_will_send}</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onResetPassword)} className='flex flex-col gap-6'>
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
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText:
                      (errors?.email?.message && dictionary?.[errors.email.message as keyof typeof dictionary]) ||
                      errorState?.message[0]
                  })}
                />
              )}
            />
            {showInfo && <Alert severity='info'>{dictionary.if_email_exist}</Alert>}
            <LoadingButton loading={isSubmitting} disabled={isSubmitting} fullWidth variant='contained' type='submit'>
              {dictionary.send_reset_link}
            </LoadingButton>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={getLocalizedUrl('/login', locale as Locale)} className='flex items-center gap-1.5'>
                <i className='tabler-chevron-left' />
                <span>{dictionary.back_to_login}</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
