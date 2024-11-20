import { useRef, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material'

import { useDictionary } from '@/contexts/dictionaryContext'
import TaskForm, { TaskFormData, TaskFormHandle } from './TaskForm'
import { UserType } from '@/types/userTypes'
import { TaskItemType } from '@/types/taskTypes'

type TaskCreateDialogProps = {
  open: boolean
  onClose: () => void
  userList: UserType[]
  taskList: TaskItemType[]
  onChangeTask: (tasks: TaskItemType) => void
}

const TaskCreateDialog = ({ open, onClose, userList, taskList, onChangeTask }: TaskCreateDialogProps) => {
  const { dictionary } = useDictionary()
  const taskFormRef = useRef<TaskFormHandle>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const onPressCreate = () => {
    taskFormRef?.current?.submit()
  }

  const onSubmit = (values: TaskFormData) => {
    const { name, content, assignee_id, assigner_id, approver_id, dependency_task_id, date_start, date_end, duration_estimated, duration_actual, salary_amount } = values

    onChangeTask({
      id: '',
      name,
      content,
      assignee_id,
      assigner_id,
      approver_id,
      dependency_task_id: dependency_task_id || null,
      date_start: date_start.toISOString(),
      date_end: date_end.toISOString(),
      duration_estimated: duration_estimated ? duration_estimated.toISOString() : null,
      duration_actual: duration_actual ? duration_actual.toISOString() : null,
      salary_amount: salary_amount || null,
    })

    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{dictionary.create_task}</DialogTitle>
      <DialogContent className='flex flex-col gap-3'>
        <TaskForm ref={taskFormRef} onSubmit={onSubmit} taskList={taskList} userList={userList} />
        {!!errorMessage && (
          <FormHelperText error className='text-right'>{errorMessage}</FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color="secondary" onClick={onClose}>{dictionary.cancel}</Button>
        <Button variant='contained' onClick={onPressCreate}>{dictionary.create}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskCreateDialog
