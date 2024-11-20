import { forwardRef, useImperativeHandle } from "react"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { array, nonEmpty, object, pipe, string, type InferInput } from "valibot"
import { Controller, useForm } from 'react-hook-form'

import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import MenuItem from "@mui/material/MenuItem"
import Alert from "@mui/material/Alert"

import { TLDSStatus } from "@/data/items/tlds"
import { useDictionary } from "@/contexts/dictionaryContext"
import CustomTextField from "@/@core/components/mui/TextField"


export type TLDSFormData = InferInput<typeof schema>

const schema = object({
  status: pipe(string(), nonEmpty('required')),
  name: pipe(string(), nonEmpty('required')),
  registrar: string(),
  policy_url: string(),
  pricing: array(object({
    tld_id: string(),
    type: string(),
    sale_price: string(),
    currency_id: string(),
    duration_unit: string(),
  }))
})

export type TLDSFormHandle = {
  submit: () => void
  clearForm: () => void
  isDirty: boolean
  getDirtyFields: () => any
}
type TLDSFormProps = {
  onSubmit: (values: TLDSFormData) => void
  initFormData?: TLDSFormData | null
}

const TLDSForm = forwardRef<TLDSFormHandle, TLDSFormProps>(function TLDSForm({ onSubmit, initFormData }, ref) {
  const { dictionary } = useDictionary()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields, isDirty }
  } = useForm<TLDSFormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      status: initFormData?.status ?? TLDSStatus[0].label,
      name: initFormData?.name ?? '',
      registrar: initFormData?.registrar ?? '',
      policy_url: initFormData?.policy_url ?? '',
      pricing: initFormData?.pricing ?? [],
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
                disabled
              >
                {TLDSStatus.map(status => (
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
      <Grid item xs={12} md={6}>
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
                disabled
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='registrar'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.registrar}</Typography>
              <CustomTextField
                {...field}
                fullWidth
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='policy_url'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.policy_url}</Typography>
              <CustomTextField
                {...field}
                fullWidth
                onChange={(e: any) => {
                  field.onChange(e.target.value)
                }}
                disabled
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='pricing'
          control={control}
          render={({ field: { value } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.pricing}</Typography>
              {value.length ? (
                <div className='flex flex-col gap-1'>
                  {value.map((price, index) => (
                    <div key={index} className='flex items-center border rounded p-4'>
                      <i className="tabler-wifi" />
                      <div className="flex items-center px-1.5 py-0.5 rounded-md mx-1" style={{ backgroundColor: 'var(--mui-palette-action-hover)' }}>
                        <Typography>{dictionary[price.type as keyof typeof dictionary]}</Typography>
                      </div>
                      <Typography>: {price.sale_price} {price.currency_id} / 1</Typography>
                      <div className="flex items-center px-1.5 py-0.5 rounded-md mx-1" style={{ backgroundColor: 'var(--mui-palette-action-hover)' }}>
                        <Typography>{dictionary[price.duration_unit as keyof typeof dictionary]}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant='outlined' severity='info'>{dictionary.no_pricing}</Alert>
              )}
            </div>
          )}
        />
      </Grid>
    </Grid>
  )
})

export default TLDSForm

