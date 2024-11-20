// components/RadialBarChart.js
import React from 'react'

import dynamic from 'next/dynamic'

import { size } from '@floating-ui/react'

import { ApexOptions } from 'apexcharts'
import { Avatar } from '@mui/material'

// Load ApexCharts dynamically to avoid SSR issues
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const RadialBarChart = () => {
  const HEIGHT_CHART = 140

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
      offsetY: 0
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 359,
        hollow: {
          size: '55%'
        },
        dataLabels: {
          show: false // Tắt hiển thị nhãn
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
      }
    },
    stroke: {
      dashArray: 2
    }
  }

  const numberWorkingHoursDefaultMonth = 184
  const numberWorkingHoursNow = 83.7
  const percentageOfWorkingHours = (numberWorkingHoursNow / numberWorkingHoursDefaultMonth) * 100
  const series = [percentageOfWorkingHours] // Giá trị mới của series

  return (
    <div className='relative '>
      <div id='chart' className='flex justify-center items-center'>
        <ApexCharts options={options} series={series} type='radialBar' height={HEIGHT_CHART} />
      </div>
      <div className='absolute inset-0 bottom-1 flex justify-center items-center'>
        <Avatar
          alt='John Doe'
          src='https://www.phanmemninja.com/wp-content/uploads/2023/06/avatar-facebook-nam-vo-danh.jpeg'
          className='w-16 h-16 rounded-full'
        />
      </div>
    </div>
  )
}

export default RadialBarChart
