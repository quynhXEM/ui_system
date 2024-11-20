// MUI Imports
import Button from '@mui/material/Button'

// Component Imports
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'

const DialogButton = ({ Dialog, buttonProps, dialogProps }: any) => {
  return (
    <>
      <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={Dialog} dialogProps={dialogProps} />
    </>
  )
}

export default DialogButton
