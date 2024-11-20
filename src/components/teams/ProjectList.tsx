import { useEffect, useState } from 'react'

import { Button, Card, CardContent, Grid, MenuItem } from '@mui/material'

import { readItems, updateItem } from '@directus/sdk'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import DialogButton from '@/components/dialogs/DialogButton'
import { useDirectus } from '@/contexts/directusProvider'
import { useDictionary } from '@/contexts/dictionaryContext'
import DialogCreateProject from '@/components/dialogs/project/create_project'

const statusproject = ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']

type Props = {
    team: any,
    onSuccess: Function
}

const ProjectList = ({ team, onSuccess }: Props) => {
    const { directusRequest } = useDirectus()
    const { dictionary } = useDictionary()

    const [formProject, setFormProject] = useState<string>()
    const [teamproject, setteamproject] = useState<Array<any>>([])

    const handleGetTeam_Project = async () => {
        try {
            const resault = await directusRequest(readItems('projects', { fields: ['*', 'team_id.*'] }))

            setteamproject(resault)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddProject = async () => {
        try {
            await directusRequest(updateItem('projects', formProject, { team_id: team?.id }))
                .then(resault => {
                    toast.success('Successfull !!')
                    onSuccess()
                })
                .catch(err => toast.error(err.errors[0].message))
        } catch (error) {
            console.log(error)
        }
    }

    const statusProject = (status: string) => {
        switch (status) {
            case statusproject[0]:
                return 'gray'
            case statusproject[1]:
                return 'blue'
            case statusproject[2]:
                return 'green'
            case statusproject[3]:
                return 'orange'
            case statusproject[4]:
                return 'red'
            default:
                return 'default'
        }
    }

    useEffect(() => {
        handleGetTeam_Project()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Card>
            <CardContent>
                <p className=' text-xl font-bold'>{dictionary.project_list}</p>
            </CardContent>
            {team?.projects.length != 0 &&
                team?.projects.map((item: any, index: number) => (
                    <MenuItem key={index} className='flex flex-row row justify-between items-center'>
                        <p className='text-lg font-semibold'>{item?.name}</p>
                        <div className='flex row flex-row justify-center items-center'>
                            <div
                                className='mr-2 w-3 h-3'
                                style={{ backgroundColor: statusProject(item?.status), borderRadius: 360 }}
                            ></div>
                            <p className='text-lg font-bold' style={{ color: statusProject(item?.status) }}>
                                {item?.status}
                            </p>
                        </div>
                    </MenuItem>
                ))}
            <CardContent className='flex flex-row row justify-between items-center'>
                <p className='text-xl font-bold'>{dictionary.add_project}</p>
                <DialogButton
                    Dialog={DialogCreateProject}
                    buttonProps={{
                        children: <p>{dictionary.create}</p>
                    }}
                    dialogProps={{
                        onSuccess: onSuccess,
                        onFunt: () => { }
                    }}
                />
            </CardContent>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {teamproject.length != 0 && (
                            <CustomTextField
                                select
                                fullWidth
                                value={formProject || ''}
                                label={dictionary.project}
                                onChange={(e: any) => {
                                    setFormProject(e.target.value)
                                }}
                            >
                                {teamproject?.map((item, index) => (
                                    <MenuItem className='flex flex-row row justify-between items-center' key={index} value={item?.id}>
                                        <p>{item?.name}</p>
                                        <p>{item?.team_id?.name}</p>
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        )}
                    </Grid>
                </Grid>
                <Grid item className='mt-3'>
                    <Button className='w-full' variant='contained' onClick={handleAddProject}>
                        {dictionary.submit}
                    </Button>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ProjectList
