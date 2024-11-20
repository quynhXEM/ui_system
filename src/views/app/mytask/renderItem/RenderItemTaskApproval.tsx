import React from 'react'

import { Avatar, Box, Card, Paper, Typography } from '@mui/material'

import { TaskType } from '@/types/task/taskTypes'

interface props {
    setSelectedIdDetailTask: (id: string) => void
    onClickDetailTask: () => void
    item: TaskType
}

const RenderItemTaskApproval = (props: props) => {
    const currentDate = new Date()
    const dateEnd = new Date(props.item.date_end)
    const dateStart = new Date(props.item.date_start)
    const isCurrentDateGreater = dateEnd.getTime() > currentDate.getTime()

    const handlShowDetailTask = () => {
        props.onClickDetailTask()
        props.setSelectedIdDetailTask(props.item.id)
    }

    const handleToLink = () => {
        console.log("link");

    }

    return (
        <div>
            <Card className='flex items-center p-2.5 my-3 shadow-sm cursor-pointer'>
                <Avatar
                    alt='John Doe'
                    src={props.item.assignee_id && props.item.assignee_id.avatar}
                    className='w-6 h-6 mr-2'
                />
                <div className='flex flex-grow flex-row items-center' onClick={handlShowDetailTask}>
                    <div className={`${isCurrentDateGreater ? 'bg-green-600' : 'bg-orange-600'} flex flex-row justify-center py-1 w-7 rounded-md text-white text-xs font-bold`}>
                        {dateStart.getDate()}
                    </div>
                    <div className=' mx-2 '>
                        <Typography className='font-semibold text-blue-600' style={{ fontSize: 15 }}>{props.item.name}</Typography>
                    </div>
                </div>
                <div className='relative group' onClick={handleToLink}>
                    <Typography className='text-xs p-1 cursor-pointer text-blue-600'>Support</Typography>
                    <div className='absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300'></div>
                </div>
            </Card>
        </div>
    )
}

export default RenderItemTaskApproval
