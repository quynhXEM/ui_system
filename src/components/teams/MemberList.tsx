import { useEffect, useState } from 'react'

import { Button, Card, CardContent, Grid, MenuItem, MenuList } from '@mui/material'

import { createItem, deleteItem, readItems } from '@directus/sdk'

import { toast } from 'react-toastify'

import { useDictionary } from '@/contexts/dictionaryContext'
import { useDirectus } from '@/contexts/directusProvider'
import CustomTextField from '@/@core/components/mui/TextField'
import { UserRole } from '@/data/items/user'

type Props = {
    team: any
    onSuccess: Function
}

const MemberList = ({ team, onSuccess }: Props) => {
    const { dictionary } = useDictionary()
    const [formMember, setFormMember] = useState<any>({})
    const [team_user, setteam_user] = useState<Array<any>>([])
    const [selectmember, setSelectmember] = useState()
    const { directusRequest } = useDirectus()

    const handleReMoveMembers = async (id: number) => {
        try {
            await directusRequest(deleteItem('team_users', id))
                .then(resault => {
                    toast.success('Successfull !!')
                    onSuccess()
                })
                .catch(err => toast.error(err.errors[0].message))
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddMember = async () => {
        try {
            const body = {
                team_id: team.id,
                user_id: formMember?.user_id,
                role: formMember?.role
            }

            await directusRequest(createItem('team_users', body))
                .then(resault => {
                    toast.success('Successfull !!')
                    onSuccess()
                })
                .catch(err => toast.error(err.errors[0].message))
        } catch (error) {
            console.log(error)
        }
    }

    const hanldeGetTeam_User = async () => {
        try {
            const resault = await directusRequest(readItems('team_users', { fields: ['*', 'user_id.*'] }))

            const uniqueUsers = resault.reduce((acc: any, current: any) => {
                if (!acc.find((item: any) => item?.user_id?.id === current?.user_id?.id)) {
                    acc.push(current)
                }

                return acc
            }, [])

            setteam_user(uniqueUsers)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        hanldeGetTeam_User()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Card>
            <CardContent>
                <p className=' text-xl font-bold'>{dictionary.members_list}</p>
            </CardContent>
            <MenuList>
                {team?.members.map((item: any, index: number) => (
                    <MenuItem key={index} className='flex flex-row row justify-between items-center'>
                        <p className='text-lg font-semibold flex-1'>{item?.user_id?.email}</p>
                        <p className='text-lg font-semibold '>{item?.role}</p>
                        <i
                            className='tabler-circle-x '
                            onClick={() => {
                                handleReMoveMembers(item?.id)
                            }}
                        />
                    </MenuItem>
                ))}
            </MenuList>
            <CardContent className='flex flex-row row justify-between items-center'>
                <p className='text-xl font-bold'>{dictionary.add_member}</p>
            </CardContent>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        {team_user.length != 0 && (
                            <CustomTextField
                                select
                                fullWidth
                                value={selectmember || ''}
                                label={dictionary.members}
                                onChange={(e: any) => {
                                    setSelectmember(e.target.value)
                                }}
                            >
                                {team_user?.map((item, index) => (
                                    <MenuItem
                                        onClick={() => {
                                            setFormMember({ ...formMember, user_id: item?.user_id?.id })
                                        }}
                                        key={index}
                                        value={item?.user_id?.email}
                                    >
                                        <p>{item?.user_id?.email}</p>
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <CustomTextField
                            select
                            value={formMember?.role || ''}
                            fullWidth
                            label={dictionary.role}
                            onChange={(e: any) => {
                                setFormMember({ ...formMember, role: e.target.value })
                            }}
                        >
                            {UserRole?.map((item, index) => (
                                <MenuItem key={index} value={item.label}>
                                    <p>{dictionary[item.label as keyof typeof dictionary]}</p>
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>
                </Grid>
                <Grid item className='mt-3'>
                    <Button className='w-full' variant='contained' onClick={handleAddMember}>
                        {dictionary.submit}
                    </Button>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default MemberList
