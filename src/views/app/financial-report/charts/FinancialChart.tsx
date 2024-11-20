import React from 'react'

import { useTheme } from '@mui/material'

import { ApexOptions } from 'apexcharts'

import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'


type Props = {
  data: Array<{
    date: String
    income: number | null
    expense: number | null
  }>
}

export default function FinanicailChart({ data }: Props) {
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['var(--mui-palette-success-main)', 'var(--mui-palette-error-main)'],
    dataLabels: {
      enabled: false
    },
    legend: {
      labels: {
        colors: theme.palette.mode == 'dark' ? 'white' : 'black'
      }
    },
    yaxis: {
      tickAmount: 10,
      labels: {
        style: {
          colors: theme.palette.mode == 'dark' ? 'white' : 'black'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    xaxis: {
      tickAmount: 10,
      categories: data.map(item => item.date),
      labels: {
        style: {
          colors: theme.palette.mode == 'dark' ? 'white' : 'black'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    responsive: [
      {
        breakpoint: 450,
        options: {
          chart: { height: 300 }
        }
      },
      {
        breakpoint: 700,
        options: {
          chart: { height: 350 },
          yaxis: { labels: { style: { fontSize: '0.75rem' } } },
          xaxis: { labels: { style: { fontSize: '0.75rem' } } }
        }
      },
      {
        breakpoint: 1080,
        options: {
          chart: { height: 400 }
        }
      },
      {
        breakpoint: 3000,
        options: {
          chart: { height: 500 },
          yaxis: { labels: { style: { fontSize: '1.5rem' } } },
          xaxis: { labels: { style: { fontSize: '1.5rem' } } }
        }
      }
    ]
  }

  const seriesChart: ApexAxisChartSeries = [
    {
      name: 'Tổng thu',
      data: data.map(item => item.income)
    },
    {
      name: 'Tổng chi',
      data: data.map(item => item.expense)
    }
  ]

  
return <AppReactApexCharts type='area' width='100%' options={options} series={seriesChart} />
}
