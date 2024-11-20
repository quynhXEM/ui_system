import React from 'react'

import { Avatar, Typography } from '@mui/material'

import { MemberItemType } from '@/types/member/memberTypes'

interface props {
    item: MemberItemType
}

const RenderItemMember = (props: props) => {
    return (
        <div className='relative group mx-2'>
            <Avatar
                alt='John Doe'
                src={props.item.avatar ? props.item.avatar : ''}
                className='w-6 h-6'
            />
            <Typography className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 py-1 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity'>
                {props.item.username} 30%
            </Typography>
        </div>
    )
}

export default RenderItemMember
