import React, { useEffect, useState } from 'react'

import { Avatar, Button, Modal, Paper, Typography } from '@mui/material'

import { format } from 'date-fns'

import { readItem, updateItem } from '@directus/sdk'

import { useSession } from 'next-auth/react'

import { TaskType } from '@/types/task/taskTypes'
import { useDictionary } from '@/contexts/dictionaryContext'
import { useDirectus } from '@/contexts/directusProvider'
import ContentEditor from '@/components/tasks/ContentEditor'
import SplitButton from '@/components/form/SplitButton'
import { STATUS } from '@/utils/getStatus'
import ChatForWork from '@/views/app/mytask/ChatForWork'

interface props {
  selectIdApproval: string
  openModalDetailsTask: boolean
  oncloseModal: () => void
  idTask: string
  resetTask: (id: any) => void
}

const ModalApprovedTask = (props: props) => {
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const auth = useSession().data?.user

  const [idTask, setIdTask] = useState<string>(props.idTask)

  const [dataTask, setDataTask] = useState<TaskType>()

  const [comment, setComment] = useState<string>('')

  const dateStart = dataTask ? new Date(dataTask?.date_end) : new Date()
  const dateTask = format(dateStart, 'dd/MM/yyyy')

  const getDataDetailTask = async () => {
    try {
      const result = await directusRequest(
        readItem('tasks', idTask, {
          fields: ['*', 'user_created.*', 'assignee_id.*', 'assigner_id.*', 'project_id.name']
        })
      )

      if (result) {
        setDataTask(result)
      }
    } catch (error) {
      console.log('getDataDetailTask:', error)
    }
  }

  const handleCloseTask = () => {
    // updateStatusTask(STATUS.PAUSED)
    props.oncloseModal()
  }

  const uploadImage = async (file: File, title: string) => {
    const folder = title === '' ? '2581b425-459d-415a-bed6-a3fda7733426' : '030e3df4-e5c3-4ccc-896e-ab217e15f94b'

    const myHeaders = new Headers()

    myHeaders.append('Authorization', `Bearer ${auth?.access_token}`)

    const formData = new FormData()

    formData.append('folder', folder)
    formData.append('[]', file)

    const requestOptions: RequestInit = {
      headers: myHeaders,
      method: 'POST',
      body: formData,
      redirect: 'follow'
    }

    try {
      const response = await fetch('https://soc.socjsc.com/files', requestOptions)
      const result = await response.json()

      if (result?.data) {
        return { status: true, data: result.data }
      } else {
        return { status: false, data: '' }
      }
    } catch (error) {
      console.error(error)

      return { status: false, data: '' }
    }
  }

  const convertBase64ImagesToLinks = async (htmlContent: string): Promise<string> => {
    try {
      const imgTagRegex = /<img src="data:image\/(png|jpeg);base64,([^"]+)"\s*\/?>/g
      let match: RegExpExecArray | null
      const promises: Promise<{ originalMatch: string; imageUrl: string }>[] = []

      // Tìm tất cả ảnh base64
      while ((match = imgTagRegex.exec(htmlContent)) !== null) {
        if (match) {
          const originalMatch = match[0]
          const base64Data = match[2]
          const mimeType = match[1]
          const fileName = `image.${mimeType}`

          // // Lấy kích thước ảnh
          // const size = await getImageSizeFromBase64(`data:image/${mimeType};base64,${base64Data}`);

          // Chuyển base64 thành file Blob và sau đó là File
          const file = await fetch(`data:image/${mimeType};base64,${base64Data}`)
            .then(res => res.blob())
            .then(blob => new File([blob], fileName, { type: `image/${mimeType}` }))

          // Đẩy lệnh upload vào promises với thông tin thay thế
          const uploadPromise = uploadImage(file, 'file').then(data => {
            const imageUrl = `https://soc.socjsc.com/assets/${data.data.id}/yyy`

            return { originalMatch, imageUrl }
          })

          promises.push(uploadPromise)
        }
      }

      // Đợi tất cả ảnh tải lên xong và tiến hành thay thế
      const results = await Promise.all(promises)

      results.forEach(({ originalMatch, imageUrl }) => {
        htmlContent = htmlContent.replace(
          originalMatch,
          `<img src="${imageUrl}" style={{width: '100%', height: '100%', resize: 'block'}}/>`
        )
      })

      return htmlContent
    } catch (error) {
      console.log('convertBase64ImagesToLinks:', error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    if (comment.trim().length == 0) return
  }

  const handleEdit = async (status: string) => {
    await directusRequest(
      updateItem('tasks', idTask, {
        status: status
      })
    )
  }

  const options = [
    {
      id: 1,
      label: 'Cần chỉnh sửa',
      funt: () => {
        handleEdit(STATUS.PAUSED)
        props.oncloseModal()
      },
      color: 'warning',
      icon: 'arrow-back-up'
    },
    {
      id: 21,
      label: 'Xác nhận',
      funt: () => {
        handleEdit(STATUS.APPROVED)
        props.oncloseModal()
      },
      color: 'success',
      icon: 'circle-check'
    }
  ]

  const optionsApproved = [
    {
      id: 1,
      label: 'Đồng ý ',
      funt: () => {
        handleEdit(STATUS.TODO)
        props.oncloseModal()
      },
      color: 'success',
      icon: 'thumb-up'
    },
    {
      id: 2,
      label: 'Hủy nhiệm vụ',
      funt: () => {
        handleEdit(STATUS.CANCELLED)
        props.oncloseModal()
      },
      color: 'warning',
      icon: 'cancel'
    }
  ]

  useEffect(() => {
    const callAPI = async () => {
      await getDataDetailTask()

      // if (dataTask?.status === STATUS.PAUSED) {
      //   await updateStatusTask(STATUS.DOING);
      // }
    }

    callAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idTask])

  if (!dataTask) {
    return <></>
  }

  return (
    <Modal open={props.openModalDetailsTask}>
      <div className='flex flex-col h-full items-center overflow-y-auto'>
        <Paper className='w-full sm:w-8/12 rounded-2xl p-4 my-24'>
          <div className='w-full h-full'>
            <div className='flex justify-between items-center text-center'>
              <p className='font-bold text-lg'>{dataTask ? dataTask?.name : ''}</p>
              <div onClick={handleCloseTask} className='cursor-pointer'>
                <i className='tabler-x' />
              </div>
            </div>
            <div className='w-full bg-gray-200 my-2' style={{ height: 1 }}></div>
            <div className='py-2 flex justify-between'>
              <div className='flex flex-row items-center'>
                <Avatar
                  alt={dataTask?.assignee_id?.name}
                  src={dataTask?.assignee_id?.avatar}
                  className='w-12  h-12 mr-3'
                />
                <div className='flex-col col'>
                  <Typography className='font-bold'>{dataTask?.assignee_id?.full_name}</Typography>
                  <div className='row flex items-center'>
                    <Typography>{dictionary.delivered_by}</Typography>
                    <Avatar
                      alt={dataTask?.assigner_id?.full_name}
                      src={dataTask?.assigner_id?.avatar}
                      className='w-6  h-6 mx-3 '
                    />
                    <Typography className='font-bold'>{dataTask?.assigner_id?.full_name}</Typography>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <div className='flex flex-row items-center text-end '>
                  <i className='tabler-clock mr-2 text-base text-red-600'></i>
                  <Typography className='font-bold text-red-600 text-sm' fontSize={12}>
                    {dataTask ? dateTask : ''}
                  </Typography>
                </div>
                <Typography className='font-bold text-blue-600 text-sm text-end' fontSize={12}>
                  {dataTask ? dataTask?.project_id?.name : ''}
                </Typography>
              </div>
            </div>
            <div className='mt-4 flex items-center justify-end mb-5'>
              {dataTask?.status === STATUS.DONE && <SplitButton listbutton={options} task_id={idTask} />}
              {dataTask?.status === STATUS.PROPOSED && <SplitButton listbutton={optionsApproved} task_id={idTask} />}
            </div>
            <div className='w-full bg-gray-200 my-2' style={{ height: 1 }}></div>
            <ChatForWork task={dataTask} />
          </div>
        </Paper>
      </div>
    </Modal>
  )
}

export default ModalApprovedTask
