import React from 'react'

import PropTypes from 'prop-types'
import { Typography } from '@mui/material'

interface props { }

const RenderItemTransaction = (props: props) => {
  return (
    <div className='flex flex-col sm:flex-row border-b border-gray-200 mb-4'>
      <div className='flex flex-col items-center'>
        <div className='h-16 w-16 rounded-full bg-blue-700 flex justify-center items-center'>
          <span className='text-lg font-bold text-white'>26</span>
        </div>
        <div className='px-2 py-1 bg-gray-200 rounded my-2'>
          <span className='text-xs font-bold text-black'>2022-11</span>
        </div>
      </div>
      <div className='w-full'>
        <div className='ml-3 mb-3 p-3 rounded-lg hover:shadow-lg '>
          <div className='w-full flex flex-row justify-between'>
            <div className='flex flex-row items-center'>
              <i className='tabler-arrow-right text-base text-blue-700 font-bold mr-1' />
              <Typography className='text-base font-semibold'>Domain</Typography>
            </div>
            <Typography>+3.000.000</Typography>
          </div>
          <Typography>Mua tên miền thiết kế web số</Typography>
        </div>
        <div className='ml-3 mb-3 p-3 rounded-lg hover:shadow-lg '>
          <div className='w-full flex flex-row justify-between'>
            <div className='flex flex-row items-center'>
              <i className='tabler-arrow-right text-base text-blue-700 font-bold mr-1' />
              <Typography className='text-base font-semibold'>Domain</Typography>
            </div>
            <Typography>+3.000.000</Typography>
          </div>
          <Typography>Mua tên miền thiết kế web số</Typography>
        </div>
      </div>
    </div>
  )
}

export default RenderItemTransaction
