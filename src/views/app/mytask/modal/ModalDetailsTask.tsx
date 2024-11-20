import React, { useEffect, useState } from 'react'

import { Avatar, Button, Modal, Paper, Typography } from '@mui/material'

import { format } from 'date-fns'

import { readItem, updateItem } from '@directus/sdk'

import { useSession } from 'next-auth/react'

import { useSettings } from '@/@core/hooks/useSettings'
import { TaskType } from '@/types/task/taskTypes'
import { useDictionary } from '@/contexts/dictionaryContext'
import { useDirectus } from '@/contexts/directusProvider'
import { STATUS } from '@/utils/getStatus'
import CountdownTimer from '@/components/time/CountTimer'
import ContentEditor from '@/components/tasks/ContentEditor'
import TextEditor from '@/components/form/TextEditor'
import ChatForWork from '@/views/app/mytask/ChatForWork'

interface props {
  selectIdApproval: string
  openModalDetailsTask: boolean
  oncloseModal: () => void
  idTask: string
  resetTask: (id: any) => void
}

const ModalDetailsTask = (props: props) => {
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const auth = useSession().data?.user

  const [idTask, setIdTask] = useState<string>(props.idTask)

  const [dataTask, setDataTask] = useState<TaskType>()

  const [comment, setComment] = useState<string>('')

  const [isActive, setIsActive] = useState<boolean>(true)

  // dataTask ? new Date(dataTask?.date_end) :
  const dateStart = new Date()
  const dateTask = format(dateStart, 'dd/MM/yyyy')

  const getDataDetailTask = async () => {
    try {
      const result = await directusRequest(
        readItem('tasks', idTask, {
          fields: ['*', 'project_id.*', 'assigner_id.*', 'assignee_id.*']
        })
      )

      if (result) {
        setDataTask(result)

        // console.log(result)
      }
    } catch (error) {
      console.log('getDataDetailTask:', error)
    }
  }

  const handleCloseTask = () => {
    props.oncloseModal()
  }

  const handleDoneTask = async () => {
    props.resetTask(idTask)
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

  useEffect(() => {
    const callAPI = async () => {
      await getDataDetailTask()
    }

    callAPI()
    
    // console.log(auth?.avatar)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idTask])

  if (!dataTask) {
    return <></>
  }

  return (
    <Modal open={props.openModalDetailsTask}>
      <div className='flex flex-col h-full items-center overflow-y-auto'>
        <Paper className='w-full sm:w-8/12 rounded-2xl p-4 my-24 '>
          <div className='w-full h-full'>
            <div className='flex justify-between items-center'>
              <h4>{dataTask?.name}</h4>
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
                  <Typography>{dataTask?.assignee_id?.full_name}</Typography>
                  {dataTask?.assigner_id?.id == auth?.id ? (
                    <Typography className='font-normal' color='text.primary' fontSize={12}>
                      {dictionary.self_delivery}
                    </Typography>
                  ) : (
                    <div className='row flex items-center'>
                      <Typography>{dictionary.delivered_by}</Typography>
                      <Avatar
                        alt={dataTask?.assigner_id?.full_name}
                        src={dataTask?.assigner_id?.avatar}
                        className='w-6  h-6 mx-3 '
                      />
                      <Typography>{dataTask?.assigner_id?.full_name}</Typography>
                    </div>
                  )}
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
                  {dataTask?.project_id?.name}
                </Typography>
              </div>
            </div>
            <div className='w-full bg-gray-200 my-2' style={{ height: 1 }}></div>
            {/* <div
              className='mx-5 mt-3 mb-10 overflow-hidden'
              dangerouslySetInnerHTML={{ __html: dataTask ? dataTask?.content : '' }}
            />
            <div className='flex flex-row items-center'>
              <Avatar alt='John Doe' src={auth?.image} className='w-8  h-8 mr-3' />
              <div className=' w-full '>
                <ContentEditor initialValue={comment} onChange={setComment} />
              </div>
              <Button className=' flex justify-center ml-2' onClick={handleSendMessage}>
                <i className='tabler-brand-telegram text-xl' />
              </Button>
            </div> */}
            <ChatForWork task={dataTask}/>
            <div className='mt-4 flex flex-row items-center'>
              <Button className='flex flex-row justify-between items-center bg-green-700 mr-3' onClick={handleDoneTask}>
                <i className='tabler-check text-xl text-white mr-2' />
                <span className='text-white'>{dictionary.done}</span>
              </Button>
              <CountdownTimer initialSeconds={0} isActive={isActive} />
            </div>
          </div>
        </Paper>
      </div>
    </Modal>
  )
}

export default ModalDetailsTask
