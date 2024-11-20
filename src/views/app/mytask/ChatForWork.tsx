import { useEffect, useRef, useState } from 'react'

import { readItem, readItems } from '@directus/sdk'

import { Avatar, Button, Card, Typography, useTheme } from '@mui/material'

import { useCurrentSession } from '@/libs/useCurrentSession'
import { SESSION_STATUS } from '@/utils/getStatus'
import { useDirectus } from '@/contexts/directusProvider'
import ContentEditor from '@/components/tasks/ContentEditor'
import { TaskType } from '@/types/task/taskTypes'
import { StyleHtmlImage } from '@/libs/FormatImage'
import { useDictionary } from '@/contexts/dictionaryContext'

type Props = {
  task: TaskType
}

const ChatForWork = (props: Props) => {
  const theme = useTheme()
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const { session, status } = useCurrentSession()
  const scrollableDivRef = useRef(null)

  const [messages, setMessages] = useState<any>([
    { sender: 'John', message: "How's the progress on the task?" },
    { sender: 'You', message: "It's going well. I've completed about 50% of it." }
  ])

  const getHistory = async () => {
    await directusRequest(readItem('tasks', props.task?.id, []))
      .then(data => {
        setNewMessage(data)
      })
      .catch(error => {
        console.info('Lỗi lấy dữ liệu')
      })
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'You', message: StyleHtmlImage(newMessage.trim()) }])
      setNewMessage('')
    }
  }

  useEffect(() => {
    if (status !== SESSION_STATUS.AUTHEN || !session || !session?.user) return

    // getHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const scrollEnd = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollEnd()
  })

  return (
    <div className='w-full'>
      <div className=''>
        <nav className='-mb-px flex' aria-label='Tabs'>
          <button
            onClick={() => setActiveTab('description')}
            className={`w-1/2 py-2 px-1 bg-transparent text-center border-b-2 text-sm font-bold 
              ${activeTab === 'description' ? 'border-primary text-primary' : theme.palette.mode == 'light' ? 'text-black' : 'text-white'}
            `}
          >
            {dictionary.desciption}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-1/2 py-2 px-1 bg-transparent text-center border-b-2 font-bold text-sm
              ${activeTab === 'chat' ? 'border-primary text-primary' : theme.palette.mode == 'light' ? 'text-black' : 'text-white'}
            `}
          >
            {dictionary.discuss_work}
          </button>
        </nav>
      </div>
      <div className='mt-4'>
        {activeTab === 'description' && (
          <div ref={scrollableDivRef} className='overflow-y-scroll w-full rounded-md border max-h-[400px]'>
            <div className='p-4 space-y-4'>
              <div
                className=' mt-1 overflow-hidden'
                dangerouslySetInnerHTML={{ __html: props?.task?.content || '<p>adsakvhdwuad9adan</p>' }}
              />
            </div>
          </div>
        )}
        {activeTab === 'chat' && (
          <>
            <div ref={scrollableDivRef} className='overflow-y-scroll w-full rounded-md border mb-4 max-h-[400px]'>
              <div className='p-4 space-y-4 '>
                {messages.map((msg: any, index: number) => (
                  <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <Card className={`rounded-lg p-2 max-w-[80%] `}>
                      <p className='text-sm font-semibold'>{msg.sender}</p>
                      <div
                        className=' mt-1 overflow-hidden'
                        dangerouslySetInnerHTML={{ __html: msg?.message || '<p>Nội dung nhắn gửi</p>' }}
                      />
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex row flex-row space-x-2 items-center'>
              <div className='flex-1'>
                <ContentEditor initialValue={newMessage} onChange={setNewMessage} />
              </div>
              <Button variant='outlined' className='h-12' onClick={handleSendMessage}>
                <i className='tabler-brand-telegram text-xl' />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ChatForWork
