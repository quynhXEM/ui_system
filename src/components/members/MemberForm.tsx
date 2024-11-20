import { forwardRef, useImperativeHandle, useState } from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Controller, useForm } from 'react-hook-form'

import { file, object, string } from 'valibot'
import type { InferInput } from 'valibot'

import { Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'

import { useDictionary } from '@/contexts/dictionaryContext'
import { UserRole } from '@/data/items/user'
import CustomTextField from '@/@core/components/mui/TextField'

export type MemberFormData = InferInput<typeof schema>

const schema = object({
    role: string(),
    last_name: string(),
    first_name: string(),
    email: string(),
    password: string(),
    avatar: string(),
    location: string(),
    title: string(),
    description: string(),
    tags: string()
})

type MemberFormProps = {
    onSubmit: (values: MemberFormData) => void
    initFormData?: MemberFormData | null
}

export type MemberFormHandle = {
    submit: () => void
    clearForm: () => void
    isDirty: boolean
    getDirtyFields: () => any
}

const MemberForm = forwardRef<MemberFormHandle, MemberFormProps>(function MemberForm({ onSubmit, initFormData }, ref) {
    const { dictionary } = useDictionary()
    const [isPasswordShown, setisPasswordShown] = useState()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, dirtyFields, isDirty }
    } = useForm<MemberFormData>({
        resolver: valibotResolver(schema),
        defaultValues: {
            role: initFormData?.role ?? UserRole[0].label,
            last_name: initFormData?.last_name ?? '',
            first_name: initFormData?.first_name ?? '',
            email: initFormData?.email ?? '',
            password: initFormData?.password ?? '',
            avatar: initFormData?.avatar ?? '',
            location: initFormData?.location ?? '',
            title: initFormData?.title ?? '',
            description: initFormData?.description ?? '',
            tags: initFormData?.tags ?? ''
        }
    })

    useImperativeHandle(ref, () => {
        return {
            submit() {
                handleSubmit(onSubmit)()
            },
            clearForm() {
                reset()
            },
            isDirty,
            getDirtyFields() {
                return dirtyFields
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDirty])

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Controller
                    name='role'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.role}</Typography>
                            <CustomTextField
                                {...field}
                                select
                                fullWidth
                                placeholder={dictionary.select_role}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                                {UserRole.map((item, index) => (
                                    <MenuItem key={index} value={item.label}>{dictionary[item.label as keyof typeof dictionary]}</MenuItem>
                                ))}
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Controller
                    name='first_name'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.first_name}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                placeholder={dictionary.first_name}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Controller
                    name='last_name'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.last_name}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                placeholder={dictionary.last_name}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.email}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                placeholder={dictionary.email}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.password}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                type={isPasswordShown ? 'text' : 'password'}
                                placeholder={dictionary.password}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton edge='end' onClick={() => { setisPasswordShown(!isPasswordShown) }} onMouseDown={e => e.preventDefault()}>
                                                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Controller
                    name='location'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.location}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                placeholder={dictionary.location}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.title}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                placeholder={dictionary.title}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Controller
                    name='avatar'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.avatar}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                placeholder={dictionary.avatar}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Typography className='font-medium'>{dictionary.desciption}</Typography>
                            <CustomTextField
                                {...field}
                                fullWidth
                                placeholder={dictionary.desciption}
                                onChange={(e: any) => field.onChange(e.target.value)}
                                disabled={isSubmitting}
                            >
                            </CustomTextField>
                        </div>
                    )}
                >
                </Controller>
            </Grid>
        </Grid>
    )
})

export default MemberForm
