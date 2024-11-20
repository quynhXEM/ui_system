import { ChangeEvent, forwardRef, useImperativeHandle } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { date, nonEmpty, nullable, number, object, pipe, string } from 'valibot'
import type { InferInput } from 'valibot'

import moment from 'moment'

import { Grid, MenuItem, Typography } from '@mui/material'


import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDictionary } from '@/contexts/dictionaryContext'
import { TaskStatus } from '@/data/items/task'
import TextEditor from '@/components/form/TextEditor'
import { UserType } from '@/types/userTypes'
import { TaskItemType } from '@/types/taskTypes'
import NumberInput from '@components/form/NumberInput'

export type TaskFormData = InferInput<typeof schema>

const schema = object({
  project_id: string(),
  status: pipe(string(), nonEmpty('required')),
  name: pipe(string(), nonEmpty('required')),
  content: string(),
  date_start: date(),
  date_end: date(),
  dependency_task_id: string(),
  assigner_id: string(),
  assignee_id: pipe(string(), nonEmpty('required')),
  approver_id: string(),
  duration_estimated: nullable(date()),
  duration_actual: nullable(date()),
  salary_amount: number()
})

export type TaskFormHandle = {
  submit: () => void
  clearForm: () => void
  isDirty: boolean
  getDirtyFields: () => any
}
type TaskFormProps = {
  onSubmit: (values: TaskFormData) => void
  initFormData?: TaskFormData | null
  currentTask?: string
  userList: UserType[]
  taskList: TaskItemType[]
}

const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(function TaskForm(
  { onSubmit, initFormData, currentTask, userList, taskList },
  ref
) {
  const { dictionary } = useDictionary()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields, isDirty }
  } = useForm<TaskFormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      project_id: initFormData?.project_id ?? '',
      status: initFormData?.status ?? TaskStatus[0].label,
      name: initFormData?.name ?? '',
      content: initFormData?.content ?? '',
      date_start: initFormData?.date_start ? moment(initFormData?.date_start).toDate() : new Date(),
      date_end: initFormData?.date_end ? moment(initFormData?.date_end).toDate() : new Date(),
      dependency_task_id: initFormData?.dependency_task_id ?? '',
      assigner_id: initFormData?.assigner_id ?? '',
      assignee_id: initFormData?.assignee_id ?? '',
      approver_id: initFormData?.approver_id ?? '',
      duration_estimated: initFormData?.duration_estimated ? moment(initFormData?.duration_estimated).toDate() : null,
      duration_actual: initFormData?.duration_actual ? moment(initFormData?.duration_actual).toDate() : null,
      salary_amount: initFormData?.salary_amount ?? 0
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
      <Grid item xs={12} md={6}>
        <Controller
          name='project_id'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.project}</Typography>
              <CustomTextField
                {...field}
                defaultValue=""
                select
                fullWidth
                placeholder=""
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled
                {...(errors.name && {
                  error: true,
                  helperText:
                    errors?.project_id?.message && dictionary?.[errors.project_id.message as keyof typeof dictionary]
                })}
              >
                <MenuItem value=""></MenuItem>
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.status}</Typography>
              <CustomTextField
                {...field}
                select
                fullWidth
                placeholder={dictionary.status}
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled={!initFormData?.status || isSubmitting}
              >
                {TaskStatus.map(status => (
                  <MenuItem key={status.label} value={status.label}>
                    <div className='flex flex-row gap-2 items-center'>
                      <div className='h-2 w-2 rounded-full' style={{ backgroundColor: status.color }} />
                      <Typography>{dictionary[status.label as keyof typeof dictionary]}</Typography>
                    </div>
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.name}</Typography>
              <CustomTextField
                {...field}
                fullWidth
                placeholder={dictionary.enter_name}
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                {...(errors.name && {
                  error: true,
                  helperText: errors?.name?.message && dictionary?.[errors.name.message as keyof typeof dictionary]
                })}
                disabled={isSubmitting}
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='content'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.content}</Typography>
              <TextEditor value={value} placeholder={dictionary.enter_content} onChange={onChange} />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='date_start'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.date_start}</Typography>
              <AppReactDatepicker
                selected={value}
                placeholderText={dictionary.date_start}
                dateFormat={'dd-MM-yyyy HH:mm:ss'}
                onChange={(date: Date | null) => onChange(date)}
                customInput={<CustomTextField fullWidth />}
                showTimeInput
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='date_end'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.date_end}</Typography>
              <AppReactDatepicker
                selected={value}
                placeholderText={dictionary.date_end}
                dateFormat={'dd-MM-yyyy HH:mm:ss'}
                onChange={(date: Date | null) => onChange(date)}
                customInput={<CustomTextField fullWidth />}
                showTimeInput
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='assignee_id'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.assignee}</Typography>
              <CustomTextField
                {...field}
                defaultValue=""
                select
                fullWidth
                placeholder=""
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled={isSubmitting}
                {...(errors.assignee_id && {
                  error: true,
                  helperText: errors?.assignee_id?.message && dictionary?.[errors.assignee_id.message as keyof typeof dictionary]
                })}
              >
                {userList.map(user => (
                  <MenuItem key={user.id} value={user.id}>{`${user.full_name || user.username} ${user.email ? `(${user.email})` : ''}`}</MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='approver_id'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.approver}</Typography>
              <CustomTextField
                {...field}
                defaultValue=""
                select
                fullWidth
                placeholder=""
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled={isSubmitting}
              >
                <MenuItem value={""}>{dictionary.no_approver}</MenuItem>
                {userList.map(user => (
                  <MenuItem key={user.id} value={user.id}>{`${user.full_name || user.username} ${user.email ? `(${user.email})` : ''}`}</MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='assigner_id'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.assigner}</Typography>
              <CustomTextField
                {...field}
                defaultValue=""
                select
                fullWidth
                placeholder="select_assigner_id"
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled={isSubmitting}
              >
                <MenuItem value={""}>{dictionary.no_assigner}</MenuItem>
                {userList.map(user => (
                  <MenuItem key={user.id} value={user.id}>{`${user.full_name || user.username} ${user.email ? `(${user.email})` : ''}`}</MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='duration_estimated'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.duration_estimated}</Typography>
              <AppReactDatepicker
                selected={value}
                placeholderText={dictionary.duration_estimated}
                dateFormat={'dd-MM-yyyy HH:mm:ss'}
                onChange={(date: Date | null) => onChange(date)}
                customInput={<CustomTextField fullWidth />}
                showTimeInput
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='duration_actual'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.duration_actual}</Typography>
              <AppReactDatepicker
                selected={value}
                placeholderText={dictionary.duration_actual}
                showTimeInput
                dateFormat='dd-MM-yyyy HH:mm:ss'
                timeIntervals={15}
                onChange={(date: Date | null) => onChange(date)}
                customInput={<CustomTextField fullWidth />}
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='dependency_task_id'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.dependency_task_id}</Typography>
              <CustomTextField
                {...field}
                defaultValue=""
                select
                fullWidth
                placeholder=""
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled={isSubmitting}
              >
                <MenuItem value={''}>{dictionary.no_dependent_task}</MenuItem>
                {taskList.map(task => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <div className='flex flex-col'>
          <Typography className='font-medium'>{dictionary.date_close}</Typography>
          <CustomTextField
            fullWidth
            disabled
            value=''
          />
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='salary_amount'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.salary_amount}</Typography>
              <NumberInput
                value={value}
                placeholder="enter_salary_amount"
                onChange={(e, val) => {
                  onChange(val)
                }}
                disabled={isSubmitting}
              />
            </div>
          )} />
      </Grid>
    </Grid >
  )
})

export default TaskForm
