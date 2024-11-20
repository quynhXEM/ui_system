import { useEffect, useState } from "react";

import { Card, CardContent, Grid } from "@mui/material";

import CashflowChart from "@/views/app/financial-report/charts/CashflowChart";
import FinanicailChart from "@/views/app/financial-report/charts/FinancialChart";

type Props = {
  timerange: String
}
type DataTypeLineChart = Array<{
  date: String
  income: number
  expense: number
}>
type DataTypeBarChart = {
  value: Array<number>
  title: Array<string>
}

const InintState = {
  data: [
    {
      date: '2024-10-01',
      income: 5000,
      expense: 2000
    },
    {
      date: '2024-10-02',
      income: 7000,
      expense: 1500
    },
    {
      date: '2024-10-03',
      income: 6000,
      expense: 3000
    },
    {
      date: '2024-10-04',
      income: 8000,
      expense: 2500
    },
    {
      date: '2024-10-05',
      income: 6500,
      expense: 1800
    }
  ],
  income: {
    title: ['Web', 'Hosting', 'Domain', 'Khác'],
    value: [20, 40, 28, 90]
  },
  expense: {
    title: ['Lương', 'Hosting', 'Domain', 'Khác'],
    value: [20, 40, 28, 90]
  }
}

export default function CashFlow({ timerange }: Props) {
  const [data, setData] = useState<DataTypeLineChart>(InintState.data)
  const [dataCashIncome, setdatadataCashIncome] = useState<DataTypeBarChart>(InintState.income)
  const [dataCashExpense, setdatadataCashExpense] = useState<DataTypeBarChart>(InintState.expense)

  const Benefit = () => {
    let income: number = 0;
    let expense: number = 0;

    data?.map((item) => {
      income = income + item.income
    })
    data?.map((item) => {
      expense += item.expense
    })

    return {
      income: income,
      expense: expense,
      benefit: income - expense
    }
  }

  useEffect(() => {
    console.log(timerange)
  }, [timerange])

  return (
    <>
      <Card className='contents-center pt-5'>
        <p className='text-center font-extrabold text-xl'>Lợi nhuận ròng</p>
        {Benefit().benefit >= 0 ? (
          <p className='text-center text-3xl font-extrabold text-green-600'>+ {Benefit().benefit}</p>
        ) : (
          <p className='text-center font-extrabold text-red-600 text-3xl'>{Benefit().benefit}</p>
        )}
        <CardContent>
          <FinanicailChart data={data} />
        </CardContent>
      </Card>
      <Grid container spacing={5} className='mt-5'>
        <Grid item xs={12} md={6}>
          <Card className='p-5 contents-center'>
            <p className='text-center font-extrabold text-xl'>Khoản thu</p>
            <p className='text-center text-3xl font-extrabold text-green-600'>+{Benefit().income}</p>
            {dataCashIncome.value.length > 0 ? (
              <CashflowChart
                data={dataCashIncome}
                colors={[
                  'rgba(var(--mui-palette-success-mainChannel)',
                  'rgba(var(--mui-palette-success-mainChannel) / 0.7)',
                  'rgba(var(--mui-palette-success-mainChannel) / 0.5)',
                  'var(--mui-palette-success-lightOpacity)'
                ]}
              />
            ) : (
              <p className='text-center'>Không có dữ liệu</p>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className='p-5 items-center '>
            <p className='text-center font-extrabold text-xl'>Khoản chi</p>
            <p className='text-center text-3xl font-extrabold text-red-600'>-{Benefit().expense}</p>
            {dataCashExpense.value.length > 0 ? (
              <CashflowChart
                data={dataCashExpense}
                colors={[
                  'rgba(var(--mui-palette-error-mainChannel)',
                  'rgba(var(--mui-palette-error-mainChannel) / 0.7)',
                  'rgba(var(--mui-palette-error-mainChannel) / 0.5)',
                  'var(--mui-palette-error-lightOpacity)'
                ]}
              />
            ) : (
              <p className='text-center'>Không có dữ liệu</p>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
