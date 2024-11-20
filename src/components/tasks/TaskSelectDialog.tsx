import { useRef } from "react"

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

import { useDictionary } from "@/contexts/dictionaryContext"

import { TaskItemType } from '@/types/taskTypes'
import TaskTableData, { TaskTableDataHandles } from "@/components/tasks/TaskTableData"

type TaskSelectDialogProps = {
  open: boolean
  onClose: () => void
  taskList: TaskItemType[]
  onChangeTask: (tasks: TaskItemType[]) => void
}

const TaskSelectDialog = ({ open, onClose, taskList, onChangeTask }: TaskSelectDialogProps) => {
  const { dictionary } = useDictionary()
  const taskListRef = useRef<TaskTableDataHandles>(null)

  const onAddTasks = () => {
    const changedList = taskListRef?.current?.getSelected() ?? []

    if (changedList.length) {
      onChangeTask(changedList)
    }

    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{dictionary.select_task}</DialogTitle>
      <DialogContent>
        <TaskTableData ref={taskListRef} rows={taskList} />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color="secondary" onClick={onClose}>{dictionary.cancel}</Button>
        <Button variant='contained' onClick={onAddTasks}>{dictionary.add}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskSelectDialog
