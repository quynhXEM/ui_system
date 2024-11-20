import { useState } from 'react'

import { Button, Card, CardContent, FormGroup } from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { useDictionary } from '@/contexts/dictionaryContext'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const initInviteForm = {
    name: '',
    email: '',
    date: Date.now()
}

const InviteForm = () => {
    const { dictionary } = useDictionary()

    const [formInvite, setFormInvite] = useState<any>(initInviteForm)

    function validateInviteForm(form: any) {
        const errors = []

        // Kiểm tra tên
        if (!form.name || form.name.trim() === '') {
            errors.push(dictionary.enter_name_invite)
        }

        // Kiểm tra email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!form.email || !emailRegex.test(form.email)) {
            errors.push(dictionary.email_is_invalid)
        }

        // Kiểm tra ngày
        if (!form.date || isNaN(new Date(form.date).getTime())) {
            errors.push(dictionary.date_is_invalid)
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        }
    }

    const handleSendInvite = async () => {
        const validateForm = validateInviteForm(formInvite)
        
        if (!validateForm.isValid) {
            validateForm.errors.map(item => toast.warn(item))
        }

        // setFormInvite(initInviteForm)
    }

    return (
        <Card className='min-h-96'>
            <CardContent>
                <p className='text-xl font-bold'>{dictionary.invite}</p>
                <FormGroup className='my-5'>
                    <CustomTextField
                        fullWidth
                        label={dictionary.name}
                        value={formInvite?.name || ''}
                        onChange={(e: any) => {
                            setFormInvite({ ...formInvite, name: e?.target?.value })
                        }}
                    />
                    <CustomTextField
                        className='my-3'
                        fullWidth
                        type='email'
                        label={dictionary.email}
                        value={formInvite?.email || ''}
                        onChange={(e: any) => {
                            setFormInvite({ ...formInvite, email: e?.target?.value })
                        }}
                    />
                    <AppReactDatepicker
                        selected={formInvite?.date || Date.now()}
                        placeholderText={dictionary.date_start}
                        dateFormat={'dd-MM-yyyy HH:mm:ss'}
                        onChange={(date: Date | null) => {
                            setFormInvite({ ...formInvite, date: date })
                        }}
                        customInput={<CustomTextField label={dictionary.date_end} fullWidth />}
                        showTimeInput
                    />
                </FormGroup>
                <Button variant='contained' className='w-full' onClick={handleSendInvite}>
                    {dictionary.send}
                </Button>
            </CardContent>
        </Card>
    )
}

export default InviteForm
