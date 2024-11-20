'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'


// Component Imports
import { useDictionary } from '@/contexts/dictionaryContext'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type BillingCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    onSuccess: Function,
    onFunt: Function
}



const RemoveTeam = ({ open, setOpen, onFunt, onSuccess }: BillingCardProps) => {
    const { dictionary } = useDictionary()
    
    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
            <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 sm:pbs-16 sm:pbe-6 sm:pli-16'>
                {dictionary.delete_team}
                <Typography component='span' className='flex flex-col text-center'>
                    {dictionary.delete_desription}
                </Typography>
            </DialogTitle>
            <form onSubmit={e => e.preventDefault()}>
                <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-16'>

                </DialogContent>
                <DialogActions className='justify-between pbs-0 p-6 sm:pbe-16 sm:pli-16'>
                    <Button variant='tonal' type='reset' color='secondary' onClick={handleClose}>
                        {dictionary.cancel}
                    </Button>
                    <Button variant='contained' type='submit' onClick={onFunt}>
                        {dictionary.delete}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default RemoveTeam
