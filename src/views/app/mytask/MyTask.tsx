'use client'
import { useEffect, useState } from 'react'

import { Button, Card, Collapse, Grid, TextField } from '@mui/material'
import { updateItem } from '@directus/sdk'

import ModalFormCreateTask from './modal/ModalFormCreateTask'

// import { useWindowSize } from '@/utils/getDeviceSize'
import TimekeepingCard from './TimekeepingCard'
import ModalDetailsTask from './modal/ModalDetailsTask'
import RenderItemTask from './renderItem/RenderItemTask'
import { useDirectus } from '@/contexts/directusProvider'
import { TaskType } from '@/types/task/taskTypes'
import { useDictionary } from '@/contexts/dictionaryContext'
import { SESSION_STATUS, STATUS, USER_ROLE } from '@/utils/getStatus'
import RenderMyTask from '@/views/app/mytask/renderItem/RenderMyTask'
import ModalShowTask from '@/views/app/mytask/modal/ModalShowTask'
import ModalApprovedTask from '@/views/app/mytask/modal/ModalApprovedTask'
import { useCurrentSession } from '@/libs/useCurrentSession'

function MyTask() {
  //Hooks
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const { session, status } = useCurrentSession()

  //State
  const [showTimekeeping, setShowTimekeeping] = useState<boolean>(false)
  const [openModalCreateTask, setOpenModalCreateTask] = useState<boolean>(false)
  const [openModalDetailsTask, setOpenModalDetailsTask] = useState<boolean>(false)
  const [openShowTask, setOpenShowTask] = useState<boolean>(false)
  const [openApprovedTask, setOpenApprovedTask] = useState<boolean>(false)
  const [dataTask, setDataTask] = useState<TaskType[]>([])
  const [reload, setreload] = useState<boolean>(true)
  const [selectedIdDetailTask, setSelectedIdDetailTask] = useState<string>('')
  const [selectIdApproval, setSelectIdApproval] = useState<string>('')

  //Socket connect
  const Socketconect = async () => {

    return 
    
    // const socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL)

    // if (!socket) return

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          type: 'auth',
          access_token: session?.user.access_token
        })
      )
    })

    socket.addEventListener('message', message => {
      const data = JSON.parse(message.data)

      console.log('=============> ', data)

      if (data?.type === 'auth' && data?.status === 'ok') {
        if (socket.readyState !== WebSocket.OPEN) return

        socket.send(
          JSON.stringify({
            type: 'subscribe',
            collection: 'tasks',
            query: {
              fields: [
                'id',
                'name',
                'status',
                'date_start',
                'assignee_id',
                'assigner_id',
                'project_id',
                'assignee_id.*',
                'assigner_id.*',
                'project_id.team_id.id',
                'project_id.team_id.members.user_id',
                'project_id.team_id.members.role'
              ]
            }
          })
        )
      }

      if (data?.type === 'subscription') {
        if (data?.event === 'init') {
          const tasks = onFilterAddRole(data.data)

          getTask(tasks)
        }

        if (data?.event === 'update') {
          const dataupdate: Array<TaskType> = data?.data

          onUpdateTask(dataupdate)
        }

        if (data?.event === 'create') {
          const dataupdate: TaskType = data?.data?.[0]

          onCreateTask(dataupdate)
        }

        if (data?.event === 'delete') {
          const dataupdate: Array<TaskType> = data?.data

          onDeleteTask(dataupdate)
        }
      }

      if (data?.type === 'ping') {
        socket.send(
          JSON.stringify({
            type: 'pong'
          })
        )
      }
    })

    socket.addEventListener('close', event => {
      console.error('WebSocket closed:', event.code, event.reason)

      // Thử kết nối lại sau một khoảng thời gian
      // setTimeout(Socketconect, 5000)
    })

    socket.addEventListener('error', error => {
      console.error('WebSocket error:', error)

      // Thông báo cho người dùng hoặc xử lý lỗi
    })

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }

  useEffect(() => {
    if (status !== SESSION_STATUS.AUTHEN || !session) return
    Socketconect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, reload])

  //Timekeeper
  const onclickShowTimekeeping = () => {
    setShowTimekeeping(!showTimekeeping)
  }

  const onFilterAddRole = (list: Array<any>) => {
    const tasks = list

    tasks?.map((task: any) => {
      if (task.project_id?.team_id?.members) {
        // Lọc thành viên trong mảng members của từng task
        const member = task.project_id.team_id.members.find((m: any) => m?.user_id === session?.user?.id)

        // Nếu tìm thấy thành viên có user_id = '', thay thế mảng bằng role
        if (member) {
          task.role = member?.role
        }
      }
    })

    return tasks
  }

  //Action Task
  const onUpdateTask = (tasks: Array<TaskType>) => {
    const task = tasks[0]
    let doing = false

    getMyTask(tasks).forEach(task => {
      if (task.status === STATUS.DOING) {
        doing = true
        setSelectedIdDetailTask(task?.id)
      }
    })

    setDataTask(prevTasks => {
      const isExsits = prevTasks.find(item => item?.id === task?.id)

      if (isExsits) {
        return prevTasks.map(item => (item?.id === task?.id ? task : item))
      } else return [...prevTasks, task]
    })

    setOpenModalDetailsTask(doing)

    if (task?.status === STATUS.DONE) {
      console.log('task da done', task)

      if (task?.assignee_id?.id === session?.user?.id) {
        setOpenModalDetailsTask(false)

        if (task?.approver_id !== session?.user?.id) {
          setDataTask(prev => prev.filter(item => item.id !== task.id))
        } else {
          setDataTask(prevData => prevData.map(item => (item?.id !== task?.id ? item : { ...task, role: item?.role })))
        }
      }
    }

    if (task?.status === STATUS.APPROVED || task?.status === STATUS.CANCELLED) {
      setOpenModalDetailsTask(false)
      setSelectedIdDetailTask(task?.id)

      setDataTask(prev => prev.filter(item => item?.id !== task?.id))
    }
  }

  const onDeleteTask = (tasks: Array<TaskType>) => {
    const deleteTask = tasks[0]

    setDataTask(prevTasks => prevTasks.filter((task: TaskType) => task.id !== deleteTask?.id))
  }

  const hanlderOpenatsk = async (task: TaskType) => {
    setSelectedIdDetailTask(task?.id)
    setOpenModalDetailsTask(true)
  }

  const getTask = (list: Array<TaskType>) => {
    getMyTask(list).forEach(task => {
      if (task.status === STATUS.DOING) {
        hanlderOpenatsk(task)

        return
      }
    })
    setDataTask(list)
  }

  const onCreateTask = (task: TaskType) => {
    setDataTask(pverData => {
      const isExsits = pverData.find(item => item?.id === task?.id)

      if (isExsits) {
        return pverData
      } else return [...pverData, task]
    })

    setreload(!reload)
  }

  const DoneTask = async (id: any) => {
    if (!id) return

    await directusRequest(
      updateItem('tasks', id, {
        status: STATUS.DONE
      })
    )
  }

  //Modal
  const handleCloseModalCreateTask = () => {
    setOpenModalCreateTask(false)
  }

  const handleOpenModalCreateTask = () => {
    setOpenModalCreateTask(true)
  }

  const handleOpenDetailsTask = async (id: string) => {
    if (!id) return

    setOpenModalDetailsTask(true)

    await directusRequest(
      updateItem('tasks', id, {
        status: STATUS.DOING
      })
    )
  }

  const handdeOpenShowTask = () => {
    setOpenShowTask(true)
  }

  const handdeClosedShowTask = () => {
    setOpenShowTask(false)
  }

  const handdeOpenApprovedTask = () => {
    setOpenApprovedTask(true)
  }

  const handdeClosedApprovedTask = () => {
    setOpenApprovedTask(false)
  }

  const handleCloseDetailsTask = async () => {
    setOpenModalDetailsTask(false)
    await directusRequest(
      updateItem('tasks', selectedIdDetailTask, {
        status: STATUS.PAUSED
      })
    )
  }

  //Filter task
  const getMyTask = (dataTasks: Array<TaskType>) => {
    return dataTasks.filter(
      item =>
        item?.assignee_id?.id === session?.user?.id &&
        item?.status !== STATUS.PROPOSED &&
        item?.status !== STATUS.DONE &&
        item?.status !== STATUS.APPROVED &&
        item?.status !== STATUS.CANCELLED
    )
  }

  const getApprovedTask = () => {
    return dataTask.filter(
      item =>
        (item.status === STATUS.PROPOSED && item?.role === USER_ROLE.OWNER) ||
        (item.status === STATUS.DONE && item?.approver_id === session?.user?.id)
    )
  }

  const getTaskProposed = () => {
    return dataTask.filter(item => item?.assigner_id?.id === session?.user?.id && item.status === STATUS.PROPOSED)
  }

  return (
    <div className='flex flex-col'>
      <Card className='flex flex-1 items-center justify-between p-3 rounded-xl mb-4 shadow-sm'>
        <h2>{session?.user?.full_name || 'Loading...'}</h2>
        <div>
          <Button className='h-16 bg-green-500 p-2 flex-col rounded-tl-lg rounded-bl-lg rounded-tr-none rounded-br-none'>
            <div className='flex flex-1 items-center'>
              <i className='tabler-circle-arrow-left text-white'></i>
              <span className='text-sm ml-1 text-white font-bold '>{dictionary.enter}</span>
            </div>
            <span className='text-xs text-white mt-2'>08:29:59</span>
          </Button>
          <Button className='h-16 bg-orange-600 -2 flex-col rounded-tl-none rounded-bl-none rounded-tr-lg rounded-br-lg'>
            <div className='flex flex-1 items-center'>
              <span className='text-sm mr-1 text-white font-bold '>{dictionary.go_out}</span>
              <i className='tabler-circle-arrow-right text-white'></i>
            </div>
            <span className='text-xs text-white mt-2'>08:29:59</span>
          </Button>
        </div>
      </Card>

      <Grid item xs={12} className='block lg:hidden'>
        <div className='w-full cursor-pointer' onClick={onclickShowTimekeeping}>
          <Card className='py-4 flex flex-row justify-center w-full'>
            <span className='text-lg font-bold'>{dictionary.timekeeping}</span>
          </Card>
        </div>
        <Collapse in={showTimekeeping}>
          <TimekeepingCard />
        </Collapse>
      </Grid>

      <Grid container xs={12}>
        <Grid item xs={12} lg={8} className='flex-grow'>
          <Card className='my-4 shadow-sm' onClick={handleOpenModalCreateTask}>
            <TextField
              placeholder={dictionary.what_are_you_going_to_do}
              className='w-full p-1.5 ml-2 focus:outline-none bg-transparent'
              id='standard-basic'
              variant='standard'
              multiline
              maxRows={Infinity}
              InputProps={{
                readOnly: true,
                disableUnderline: true
              }}
            />
          </Card>
          <div className='flex justify-between items-center  mt-6'>
            <span className='font-bold text-base'>{dictionary.waiting_to_do}</span>
            <Card className='p-2 w-8 h-8 rounded-full flex justify-center items-center shadow-sm'>
              <span className='font-bold'>{getMyTask(dataTask).length}</span>
            </Card>
          </div>
          {dataTask &&
            getMyTask(dataTask).map((item: TaskType, index: number) => (
              <RenderMyTask
                key={item.id}
                setSelectedIdDetailTask={setSelectedIdDetailTask}
                setSelectIdApproval={setSelectIdApproval}
                onClickDetailTask={handleOpenDetailsTask}
                myID={session?.user?.id}
                item={item}
              />
            ))}

          <div className='flex justify-between items-center  mt-6'>
            <span className='font-bold text-base '>{dictionary.pending_approval}</span>
            <Card className='p-2 w-8 h-8 rounded-full flex justify-center items-center shadow-sm'>
              <span className='font-bold'>{getApprovedTask().length}</span>
            </Card>
          </div>
          {dataTask &&
            getApprovedTask().map((item: TaskType) => (
              <RenderItemTask
                key={item.id}
                setSelectIdApproval={setSelectIdApproval}
                setSelectedIdDetailTask={setSelectedIdDetailTask}
                onClickDetailTask={handdeOpenApprovedTask}
                myID={session?.user?.id}
                item={item}
              />
            ))}

          <div className='flex justify-between items-center  mt-6'>
            <span className='font-bold text-base '>{dictionary.propose}</span>
            <Card className='p-2 w-8 h-8 rounded-full flex justify-center items-center shadow-sm'>
              <span className='font-bold'>{getTaskProposed().length}</span>
            </Card>
          </div>
          {dataTask &&
            getTaskProposed().map((item: TaskType) => (
              <RenderItemTask
                key={item.id}
                setSelectIdApproval={setSelectIdApproval}
                setSelectedIdDetailTask={setSelectedIdDetailTask}
                onClickDetailTask={handdeOpenShowTask}
                myID={session?.user?.id}
                item={item}
              />
            ))}
        </Grid>
        <Grid item xs={12} lg={4} className='hidden px-4 lg:block'>
          <TimekeepingCard />
        </Grid>
      </Grid>
      <ModalFormCreateTask
        openModalCreateTask={openModalCreateTask}
        oncloseModal={handleCloseModalCreateTask}
        getTask={() => {}}
      />

      {openModalDetailsTask && (
        <ModalDetailsTask
          selectIdApproval={selectIdApproval}
          openModalDetailsTask={openModalDetailsTask}
          oncloseModal={handleCloseDetailsTask}
          idTask={selectedIdDetailTask}
          resetTask={DoneTask}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'auto',
            maxHeight: '100vh'
          }}
        />
      )}
      {openApprovedTask && (
        <ModalApprovedTask
          selectIdApproval={selectIdApproval}
          openModalDetailsTask={openApprovedTask}
          oncloseModal={handdeClosedApprovedTask}
          idTask={selectedIdDetailTask}
          resetTask={() => {}}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'auto',
            maxHeight: '100vh'
          }}
        />
      )}
      {openShowTask && (
        <ModalShowTask
          selectIdApproval={selectIdApproval}
          openModalDetailsTask={openShowTask}
          oncloseModal={handdeClosedShowTask}
          idTask={selectedIdDetailTask}
          resetTask={DoneTask}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'auto',
            maxHeight: '100vh'
          }}
        />
      )}
    </div>
  )
}

export default MyTask
