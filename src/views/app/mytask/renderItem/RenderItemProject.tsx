import React from 'react'

import { Avatar, Button, Paper, Typography } from '@mui/material'

import { format } from 'date-fns';

import { ProjectItemType } from '@/types/projectTypes'
import RenderItemMember from './RenderItemMember';
import { UserItemType } from '@/types/member/memberTypes';



interface props {
    item: ProjectItemType
}

const RenderItemProject = (props: props) => {

    const date_created = format(new Date(props?.item?.date_created), 'dd/MM/yyyy')

    return (
        <Paper className='p-3 my-2'>
            <div className='flex flex-row items-center'>
                <i className='tabler-user-check mr-2 text-base text-orange-600' />
                <Typography className='text-sm text-orange-600 font-bold'>{date_created}</Typography>
            </div>
            <div className='w-full py-3 flex flex-col items-center'>
                <Typography className='text-base font-bold text-blue-600'>{props.item.name}</Typography>
                <Typography className='text-base'>{props.item.status}</Typography>
            </div>
            <div className='flex flex-row justify-center'>
                <div className='flex flex-wrap items-center'>
                    {
                        props.item.team_id.members.map((item: UserItemType, index: number) => (
                            <div className={`w-1/4 ${index >= 4 ? 'mt-4' : ''}`} key={item.user_id.id}>
                                <RenderItemMember
                                    item={item.user_id} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='flex flex-row items-center justify-between mt-5'>
                <Button className='flex flex-row items-center'>
                    <i className='tabler-user-check mr-2 text-base' />
                    <Typography className='text-sm font-bold'>Notion</Typography>
                </Button>
                <Button className='flex flex-row items-center'>
                    <i className='tabler-user-check mr-2 text-base' />
                    <Typography className='text-sm font-bold'>Telegram/Zalo</Typography>
                </Button>
            </div>
        </Paper>
    )
}


export default RenderItemProject
