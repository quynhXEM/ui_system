'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import {
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  Button,
  FormControlLabel,
  Divider,
  Radio,
  RadioGroup,
  styled,
  useTheme,
  useMediaQuery,
  FormHelperText,
  Alert,
  MenuItem,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty, literal, boolean } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'
import { login, registerUser, updateMe, withToken } from '@directus/sdk'

import countryCodes from 'country-codes-list'

import { signIn } from 'next-auth/react'

import DevelopingFeatureDialog from '@components/dialogs/DevelopingFeatureDialog'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { getCountryCode } from '@/utils/getCountryCode'

import directus from '@/libs/directus'
import Logo from '@/components/layout/shared/Logo'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import PoliciesDialog from '@/components/dialogs/PoliciesDialog'

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
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
  maxBlockSize: 345,
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
  fullName: pipe(string(), minLength(1, 'required')),
  gender: string(),
  phoneNumber: pipe(string(), nonEmpty('required'), minLength(9, 'phone_number_is_invalid')),
  email: pipe(string(), minLength(1, 'required'), email('email_is_invalid')),
  password: pipe(string(), nonEmpty('required')),
  agreeTerm: pipe(boolean(), literal(true, 'you_must_agree_term'))
})

const Register = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [showDevelopingMessage, setShowDevelopingMessage] = useState(false)
  const [showPolicies, setShowPolicies] = useState(false)
  const [callingCode, setCallingCode] = useState('')
  const [callingCodeList, setCallingCodeList] = useState<Record<string, string>[]>([])

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { dictionary } = useDictionary()
  const router = useRouter()
  const searchParams = useSearchParams()

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      fullName: '',
      gender: 'male',
      phoneNumber: '',
      email: '',
      password: '',
      agreeTerm: false
    }
  })

  useEffect(() => {
    getCallingCode()
  }, [])

  const getCallingCode = async () => {
    // Get current country code & calling code list
    const countryCode = await getCountryCode()
    const callingList = countryCodes.customArray({ name: '{countryCode}', value: '{countryCallingCode}' })
    const currentCallingCode = callingList.find(calling => calling.name === countryCode)?.value ?? '84'

    setCallingCode(currentCallingCode)
    setCallingCodeList(callingList.sort((a, b) => a.value - b.value))
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onRegister: SubmitHandler<FormData> = async (data: FormData) => {
    const countryCode = await getCountryCode()
    const { email, password, fullName, gender, phoneNumber } = data

    try {
      const registerAPI = await directus.request(registerUser(email, password))

      const loginAPI = await directus.request(login(email, password, { mode: 'json' }))

      if (loginAPI && loginAPI.access_token) {
        const updateUserAPI = await directus.request(
          withToken(
            loginAPI.access_token,
            updateMe({
              full_name: fullName,
              gender,
              phone: "+" + callingCode + (phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber),
              country_code: countryCode,
              referrer_id: process.env.NEXT_PUBLIC_REFERRER_ID
            })
          )
        )

        const loginNextAuth = await signIn('credentials', {
          email,
          password,
          rememberMe: true,
          redirect: false,
        })

        if (loginNextAuth && loginNextAuth.ok && !loginNextAuth?.error) {
          router.replace(getLocalizedUrl('/', locale as Locale))
        }
      }
    } catch (err) {
      console.log('--- ERROR register')
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
        <RegisterIllustration src={characterIllustration} alt='character-illustration' />
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
            <Typography variant='h4'>{dictionary.create_an_account}?</Typography>
            <Typography>{dictionary.explore_our_great_feature}!</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onRegister)} className='flex flex-col gap-4'>
            <Controller
              name='fullName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  label={dictionary.fullname}
                  placeholder={dictionary.enter_fullname}
                  onChange={(e: any) => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...(errors.fullName && {
                    error: true,
                    helperText:
                      errors?.fullName?.message && dictionary?.[errors.fullName.message as keyof typeof dictionary]
                  })}
                  disabled={isSubmitting}
                />
              )}
            />
            <Controller
              name='gender'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  defaultValue='male'
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  name='radio-buttons-group'
                >
                  <FormControlLabel value='male' control={<Radio disabled={isSubmitting} />} label={dictionary.male} />
                  <FormControlLabel
                    value='female'
                    control={<Radio disabled={isSubmitting} />}
                    label={dictionary.female}
                  />
                </RadioGroup>
              )}
            />
            <Controller
              name='phoneNumber'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div>
                  <Typography className='font-normal text-current' style={{ fontSize: '13px' }}>{dictionary.phone_number}</Typography>
                  <div className='flex gap-1'>
                    <CustomTextField
                      value={callingCode}
                      select
                      onChange={(e: any) => {
                        setCallingCode(e.target.value)
                      }}
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {callingCodeList.map((item, index) => (
                        <MenuItem key={item.name + index} value={item.value}>+{item.value} ({item.name})</MenuItem>
                      ))}
                    </CustomTextField>
                    <CustomTextField
                      {...field}
                      fullWidth
                      placeholder={dictionary.enter_phone_number}
                      onChange={(e: any) => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...(errors.phoneNumber && {
                        error: true,
                        helperText:
                          errors?.phoneNumber?.message &&
                          dictionary?.[errors.phoneNumber.message as keyof typeof dictionary]
                      })}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='email'
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              )}
            />
            <Controller
              name='agreeTerm'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={value}
                      onChange={e => {
                        onChange(e.target.checked)
                      }}
                    />
                  }
                  label={
                    <>
                      <div className='flex gap-1'>
                        <span>{dictionary.I_agree_with}</span>
                        <Typography className='text-primary' onClick={() => {
                          setShowPolicies(true)
                        }}>
                          {dictionary['terms_&_policies']}
                        </Typography>
                      </div>
                      {errors.agreeTerm && (
                        <FormHelperText error={true}>
                          {errors.agreeTerm.message &&
                            dictionary?.[errors.agreeTerm.message as keyof typeof dictionary]}
                        </FormHelperText>
                      )}
                    </>
                  }
                />
              )}
            />
            {errorState !== null && (
              <Alert variant='outlined' severity='error'>
                {dictionary?.[errorState.message[0] as keyof typeof dictionary]}
              </Alert>
            )}
            <LoadingButton loading={isSubmitting} disabled={isSubmitting} fullWidth variant='contained' type='submit'>
              {dictionary.register}
            </LoadingButton>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>{dictionary.already_have_an_account}</Typography>
              <Typography component={Link} href={getLocalizedUrl('/login', locale as Locale)} color='primary'>
                {dictionary.login}
              </Typography>
            </div>
            <Divider className='gap-2'>{dictionary.or}</Divider>
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
      <PoliciesDialog isOpen={showPolicies} onClose={() => setShowPolicies(false)} />
    </div>
  )
}

export default Register
