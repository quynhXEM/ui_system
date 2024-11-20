'use client'
import React, { useState } from 'react'

import PropTypes from 'prop-types'
import { Button, Card, CardContent, Grid, Modal, Paper, Typography } from '@mui/material'

import primaryColorConfig from '@/configs/primaryColorConfig'
import { useSettings } from '@/@core/hooks/useSettings'
import RenderItemTransaction from './RenderItemTransaction'
import ModalAddTransaction from './ModalAddTransaction'
import FinanicailChart from '../financial-report/charts/FinancialChart'

import TimeDropdown from '../financial-report/filter/TimeDropdown'

import WalletDropdown from '../financial-report/filter/WalletDropdown'

import { useDictionary } from '@/contexts/dictionaryContext'

const Transaction = () => {
  const { dictionary } = useDictionary()
  const [search, setSearch] = useState<string>('')
  const items = Array(4).fill('Items')
  const [timeRange, setTimeRange] = useState<String>("Toàn bộ")

  const [openModalAddTransaction, setOpenModalAddTransaction] = useState<boolean>(false)

  const handleCloseModal = () => {
    setOpenModalAddTransaction(false)
  }

  const handleOpenModal = () => {
    setOpenModalAddTransaction(true)
  }

  return (
    <div className='w-full h-full'>
      <Grid item xs={12}>
        <Card className="p-5 mb-5 flex flex-wrap justify-between ">
          <TimeDropdown setTimeRange={setTimeRange} />
          <WalletDropdown />
        </Card>
      </Grid>
      <div className='w-full h-full flex flex-row justify-center'>
        <div className=' w-full md:w-5/6 mt-7'>
          <div className='flex flex-col sm:flex-row justify-between items-center mb-3'>
            <Button className='flex items-center bg-blue-700 mb-4 sm:mb-0 w-full sm:w-44' onClick={handleOpenModal}>
              <i className='tabler-plus text-base text-white' />
              <Typography className='text-white text-sm'>{dictionary.add_transaction}</Typography>
            </Button>
            <Paper className='w-full sm:w-72'>
              <input
                value={search}
                placeholder={dictionary.search + "..."}
                onChange={value => setSearch(value.target.value)}
                className='bg-transparent p-3 focus: outline-none w-full'
              />
            </Paper>
          </div>
          <Paper className={` w-full rounded-2xl p-4`}>
            <div>
              <div className='flex flex-row items-center justify-between my-1'>
                <Typography className='text-sm font-bold'>{dictionary.money_in}</Typography>
                <Typography className='text-sm text-green-700 font-bold'>+6.000.000</Typography>
              </div>
              <div className='flex flex-row items-center justify-between my-1'>
                <Typography className='text-sm font-bold'>{dictionary.money_out}</Typography>
                <Typography className='text-sm text-red-700 font-bold'>-3.000.000</Typography>
              </div>
              <div className='w-full flex justify-end'>
                <Typography className='text-sm text-green-700 font-bold'>3.000.000</Typography>
              </div>
              <div className='w-full flex justify-center mt-3 items-center'>
                <Typography className='text-sm text-blue-700'>{dictionary.view_report_for_this_period}</Typography>
                <i className='tabler-arrow-right text-base text-blue-700 font-bold ml-1' />
              </div>
            </div>
            <div className='w-full bg-gray-200 my-3' style={{ height: 1 }}></div>
            {items.map((item, index: number) => (
              <RenderItemTransaction key={index} />
            ))}
          </Paper>
        </div>
        <ModalAddTransaction onCloseModal={handleCloseModal} openModalAddTransaction={openModalAddTransaction} />
      </div>
    </div>

  )
}

export default Transaction
