import React, { ChangeEvent, ClipboardEvent, FocusEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Autocomplete, Button, Divider, Modal, Paper, Slider, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'

import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import { createItem, readItems } from '@directus/sdk'

import { useSettings } from '@/@core/hooks/useSettings'
import { useDictionary } from '@/contexts/dictionaryContext'
import { ProjectItemType } from '@/types/projectTypes'
import { useDirectus } from '@/contexts/directusProvider'

import { UserItemType } from '@/types/member/memberTypes'
import CountdownTimer from '@/components/time/CountTimer'

// eslint-disable-next-line import/order
import dynamic from 'next/dynamic'
import { STATUS } from '@/utils/getStatus'
import ContentEditor from '@/components/tasks/ContentEditor'
import TextEditor from '@/components/form/TextEditor'
import { StyleHtmlImage } from '@/libs/FormatImage'

interface props {
  openModalCreateTask: boolean
  oncloseModal: () => void
  getTask: () => void
}

const ModalFormCreateTask = (props: props) => {
  const { directusRequest } = useDirectus()
  const { dictionary } = useDictionary()

  // Định nghĩa kiểu cho các state
  const [titleTask, setTitleTask] = useState<string>('')
  const [focusTask, setFocusTask] = useState<boolean>(false)

  const [describeTask, setDescribeTask] = useState<string>('')

  const [dataProject, setDataProject] = useState<ProjectItemType[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectItemType | null | undefined>(null)

  const [dataPerson, setDataPerson] = useState<UserItemType[]>([])
  const [selectedPerson, setSelectedPerson] = useState<UserItemType | null>(null)

  const [dateStart, setDateStart] = useState<Dayjs | null | undefined>(null)
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null)

  const [time, setTime] = useState<number>(60)
  const [isActive, setIsActive] = useState<boolean>(true)

  const [statusIsCheck, setStatusIdCheck] = useState<boolean>(false)

  const onchangeTitle = (title: string) => {
    setTitleTask(title)
  }

  const getProject = async () => {
    try {
      const project = await directusRequest(
        readItems('projects', {
          fields: [
            'id',
            'date_created',
            'name',
            'status',
            'team_id.members.user_id.id',
            'team_id.members.user_id.username',
            'team_id.members.user_id.last_name'
          ]
        })
      )

      if (project && Array.isArray(project)) {
        setDataProject(project)
      }
    } catch (error) {
      console.log('error getProject', error)
    }
  }

  useEffect(() => {
    getProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelectedProject = (value: ProjectItemType | null) => {
    setSelectedProject(value)

    if (value) {
      setDataPerson(value?.team_id?.members)
    } else {
      setDataPerson([])
    }
  }

  // const uploadImage = async (file: File, title: string) => {
  //   const session = await getSession()

  //   const folder = title === '' ? '2581b425-459d-415a-bed6-a3fda7733426' : '030e3df4-e5c3-4ccc-896e-ab217e15f94b'

  //   const myHeaders = new Headers()

  //   myHeaders.append('Authorization', `Bearer ${session?.user?.access_token}`)

  //   const formData = new FormData()

  //   formData.append('folder', folder)
  //   formData.append('[]', file)

  //   const requestOptions: RequestInit = {
  //     headers: myHeaders,
  //     method: 'POST',
  //     body: formData,
  //     redirect: 'follow'
  //   }

  //   try {
  //     const response = await fetch('https://soc.socjsc.com/files', requestOptions)
  //     const result = await response.json()

  //     if (result?.data) {
  //       return { status: true, data: result.data }
  //     } else {
  //       return { status: false, data: '' }
  //     }
  //   } catch (error) {
  //     console.error(error)

  //     return { status: false, data: '' }
  //   }
  // }

  // const convertBase64ImagesToLinks = async (htmlContent: string): Promise<string> => {
  //   try {
  //     const imgTagRegex = /<img src="data:image\/(png|jpeg);base64,([^"]+)"\s*\/?>/g
  //     let match: RegExpExecArray | null
  //     const promises: Promise<{ originalMatch: string; imageUrl: string }>[] = []

  //     // Tìm tất cả ảnh base64
  //     while ((match = imgTagRegex.exec(htmlContent)) !== null) {
  //       if (match) {
  //         const originalMatch = match[0]
  //         const base64Data = match[2]
  //         const mimeType = match[1]
  //         const fileName = `image.${mimeType}`

  //         // // Lấy kích thước ảnh
  //         // const size = await getImageSizeFromBase64(`data:image/${mimeType};base64,${base64Data}`);

  //         // Chuyển base64 thành file Blob và sau đó là File
  //         const file = await fetch(`data:image/${mimeType};base64,${base64Data}`)
  //           .then(res => res.blob())
  //           .then(blob => new File([blob], fileName, { type: `image/${mimeType}` }))
  //           .catch(error => {
  //             console.log(error)

  //             return false
  //           })

  //         // Đẩy lệnh upload vào promises với thông tin thay thế
  //         const uploadPromise = uploadImage(file, 'file').then(data => {
  //           const imageUrl = `https://soc.socjsc.com/assets/${data.data.id}/yyy`

  //           return { originalMatch, imageUrl }
  //         })

  //         promises.push(uploadPromise)
  //       }
  //     }

  //     // Đợi tất cả ảnh tải lên xong và tiến hành thay thế
  //     const results = await Promise.all(promises)

  //     results.forEach(({ originalMatch, imageUrl }) => {
  //       htmlContent = htmlContent.replace(
  //         originalMatch,
  //         `<img src="${imageUrl}" style="width: 100%; height: auto; object-fit: contain;"/>`
  //       )
  //     })

  //     return htmlContent
  //   } catch (error) {
  //     console.log('convertBase64ImagesToLinks:', error)
  //     throw error
  //   }
  // }

  const handleCreateTask = async (
    status: string,
    name: string,
    project_id: string,
    date_start: string,
    date_end: string,
    assignee_id: string
  ) => {
    try {
      if (![status, name, project_id, date_start, date_end, assignee_id].every(Boolean)) {
        return
      }

      const createTask = await directusRequest(
        createItem('tasks', {
          status: status,
          name: name,
          content: StyleHtmlImage(describeTask),
          project_id: project_id,
          date_start: date_start,
          date_end: date_end,
          assignee_id: assignee_id,
          estimated_minutes: time
        })
      )

      if (createTask) {
        props.oncloseModal()
        props.getTask()
      } else {
        console.log('thất bại')
      }
    } catch (error) {
      console.log('handleCreateTask :', error)
    }
  }

  const isCheckInforTask = useCallback(() => {
    const result = [
      STATUS.PROPOSED,
      titleTask,
      selectedProject?.id,
      dateStart?.toISOString(),
      dateEnd?.toISOString(),
      selectedPerson?.user_id.id
    ].every(Boolean)

    return result
  }, [titleTask, selectedProject, selectedPerson, dateStart, dateEnd])

  useEffect(() => {
    const result = isCheckInforTask()

    if (result) {
      setStatusIdCheck(result)
    } else {
      setStatusIdCheck(result)
    }
  }, [isCheckInforTask])

  const valuetext = (value: number) => {
    return `${value} h`
  }

  const handleChangeTime = (e: any) => {
    setTime(e.target.value)
  }

  return (
    <Modal open={props.openModalCreateTask}>
      <div className='flex flex-col h-full items-center overflow-y-auto'>
        <Paper className='w-full sm:w-8/12 rounded-2xl relative pb-4 my-24'>
          <div className='flex flex-row justify-center items-center px-4 pt-6 pb-3 relative '>
            <TextField
              value={titleTask}
              onChange={title => onchangeTitle(title.target.value)}
              placeholder={dictionary.what_are_you_going_to_do}
              className='w-full text-lg font-bold'
              id='standard-basic'
              onFocus={() => setFocusTask(true)}
              onBlur={() => setFocusTask(false)}
              variant='standard'
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: 'custom-placeholder' // Thêm lớp CSS tùy chỉnh
                }
              }}
              inputProps={{
                maxLength: 70
              }}
            />

            <div onClick={props.oncloseModal} className='cursor-pointer  flex justify-center'>
              <i className='tabler-x' />
            </div>
            {focusTask && (
              <div className='bg-orange-500 w-11 p-1 rounded-lg flex justify-center items-center absolute top-1'>
                <span className='text-xs font-semibold text-white'>{titleTask.length}/70</span>
              </div>
            )}
          </div>
          <Divider />
          <div className='text-editor w-full p-2'>
            <ContentEditor initialValue={describeTask} onChange={setDescribeTask} />
          </div>
          <div className='px-4 mt-6'>
            <div className='relative flex-1 mb-4'>
              <Autocomplete
                disablePortal
                options={dataProject}
                getOptionLabel={option => option.name}
                sx={{ width: '100%' }}
                onChange={(event, newValue) => onSelectedProject(newValue)}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder={dictionary.project}
                    sx={{
                      height: '40px',
                      '& .MuiInputBase-root': {
                        height: '40px'
                      }
                    }}
                  />
                )}
              />
            </div>
            <div className='flex flex-row '>
              <div className='relative flex-1 mr-4'>
                <Autocomplete
                  id='tags-outlined'
                  options={dataPerson}
                  getOptionLabel={option => option.user_id.username}
                  noOptionsText={dictionary.please_select_a_project_first}
                  filterSelectedOptions
                  sx={{ width: '100%' }}
                  onChange={(event, newValue) => setSelectedPerson(newValue)}
                  value={selectedPerson}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={dictionary.deliver_to}
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                          padding: '0px 9px',
                          display: 'flex',
                          alignItems: 'center',
                          boxSizing: 'border-box'
                        },
                        '& input': {
                          padding: 0,
                          margin: 0,
                          height: '100%',
                          boxSizing: 'border-box'
                        }
                      }}
                    />
                  )}
                />
              </div>
              <div className='relative flex-1'>
                <p>{dictionary.estimated_minutes}</p>
                <Slider
                  size='small'
                  step={20}
                  marks
                  min={20}
                  getAriaValueText={valuetext}
                  max={120}
                  defaultValue={60}
                  valueLabelDisplay='auto'
                  onChange={handleChangeTime}
                  aria-labelledby='restricted-values-slider'
                />
              </div>
            </div>
            <div className='flex flex-row mt-4 '>
              <div className='flex-1 mr-4 '>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateStart}
                    onChange={e => setDateStart(e)}
                    minDate={dayjs()}
                    className='w-full'
                    slots={{
                      textField: TextField
                    }}
                    slotProps={{
                      textField: {
                        placeholder: `${dictionary.date_start}`, // Thay đổi placeholder thành nội dung bạn muốn

                        sx: {
                          '& .MuiInputBase-root': {
                            height: '40px'
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className='flex-1'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateEnd}
                    onChange={e => setDateEnd(e)}
                    minDate={dayjs()}
                    className='w-full'
                    slots={{
                      textField: TextField
                    }}
                    slotProps={{
                      textField: {
                        placeholder: `${dictionary.date_end}`, // Thay đổi placeholder thành nội dung bạn muốn

                        sx: {
                          '& .MuiInputBase-root': {
                            height: '40px'
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className='flex flex-row justify-between items-center mt-7'>
              <div className='flex flex-row items-center'>
                <Button
                  className='bg-blue-500 flex flex-row justify-between items-center mr-2'
                  disabled={!statusIsCheck}
                  onClick={() => {
                    statusIsCheck &&
                      handleCreateTask(
                        STATUS.PROPOSED,
                        titleTask,
                        selectedProject ? selectedProject?.id : '',
                        dateStart ? dateStart?.toISOString() : '',
                        dateEnd ? dateEnd?.toISOString() : '',
                        selectedPerson ? selectedPerson.user_id.id : ''
                      )
                  }}
                >
                  <i className='tabler-brand-telegram text-base text-white mr-2' />
                  <span className='text-white'>{dictionary.propose}</span>
                </Button>
                <CountdownTimer initialSeconds={0} isActive={isActive} />
              </div>
              <Button
                className='bg-orange-400 flex flex-row justify-between items-center'
                disabled={!statusIsCheck}
                onClick={() =>
                  statusIsCheck &&
                  handleCreateTask(
                    STATUS.PROPOSED,
                    titleTask,
                    selectedProject ? selectedProject?.id : '',
                    dateStart ? dateStart?.toISOString() : '',
                    dateEnd ? dateEnd?.toISOString() : '',
                    selectedPerson ? selectedPerson.user_id.id : ''
                  )
                }
              >
                <i className='tabler-bolt text-base text-white mr-2' />
                <span className='text-white'>{dictionary.do_it_now}</span>
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </Modal>
  )
}

export default ModalFormCreateTask

const marks = [
  {
    value: 0,
    label: 20
  },
  {
    value: 20,
    label: 40
  },
  {
    value: 40,
    label: 60
  },
  {
    value: 60,
    label: 80
  },
  {
    value: 80,
    label: 100
  },
  {
    value: 100,
    label: 120
  }
]
