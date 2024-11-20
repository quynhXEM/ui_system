import { ReactNode } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

type CustomDialogAction = {
  label: string
  buttonProps?: any
}

export type CustomDialogData = {
  isOpen: boolean
  title: string
  contentText?: string
  contentElement?: ReactNode
  actions?: CustomDialogAction[]
}

export type CustomDialogProps = {
  dialogData: CustomDialogData
  onCloseDialog: () => void
}

const CustomDialog = ({
  dialogData: { isOpen, title, contentText, contentElement, actions },
  onCloseDialog
}: CustomDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onCloseDialog()
        }
      }}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      {(!!contentText || !!contentElement) && (
        <DialogContent>
          {!!contentText && <DialogContentText id='alert-dialog-description'>{contentText}</DialogContentText>}
          {!!contentElement && contentElement}
        </DialogContent>
      )}
      {actions && actions.length && (
        <DialogActions>
          {actions.map((action, index) => (
            <Button key={index} variant='contained' {...action.buttonProps}>
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  )
}

export default CustomDialog
