import { useTheme } from "@mui/material";
import { ApexOptions } from "apexcharts";

import AppReactApexCharts from "@/libs/styles/AppReactApexCharts"

type Props = {
  data: {
    value: Array<number>
    title: Array<string>
  }
  colors: Array<String>
}
const textSecondary = 'var(--mui-palette-text-secondary)'
const successColor = 'var(--mui-palette-success-main)'

export default function CashflowChart({ data, colors }: Props) {
    const theme = useTheme()

    const options: ApexOptions = {
        colors: colors,
        stroke: { width: 0 },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'center',
            floating: true,
            labels: {
                colors: theme.palette.mode == 'dark' ? 'white' : 'black',
            }
        },
        tooltip: { enabled: true, theme: 'false' },
        dataLabels: { enabled: false },
        labels: data.title,
        states: {
            hover: {
                filter: { type: 'none' }
            },
            active: {
                filter: { type: 'none' }
            }
        },
        plotOptions: {
            pie: {
                customScale: 0.8,
                expandOnClick: false,
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        name: {
                            color: textSecondary,
                            fontFamily: theme.typography.fontFamily
                        },
                        value: {
                            fontWeight: 500,
                            formatter: val => `${val}`,
                            color: 'var(--mui-palette-text-primary)',
                            fontFamily: theme.typography.fontFamily,
                            fontSize: theme.typography.h4.fontSize as string
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            color: successColor,
                            fontFamily: theme.typography.fontFamily,
                            fontSize: theme.typography.body1.fontSize as string
                        }
                    }
                }
            }
        },
        responsive: [
            {
                breakpoint: 450,
                options: {
                    chart: { width: '100%', height: 500 },
                    legend: { fontSize: 12 },
                    plotOptions: { pie: { donut: { labels: { total: { fontSize: '2rem' }, value: { fontSize: '2rem' } } } } },
                }
            },
            {
                breakpoint: 700,
                options: {
                    chart: { width: 400, height: 600 },
                    legend: { fontSize: 16 },
                    plotOptions: { pie: { donut: { labels: { total: { fontSize: '2.5rem' }, value: { fontSize: '2.5rem' } } } } }

                }
            },
            {
                breakpoint: 1080,
                options: {
                    chart: { width: 500, height: 700 },
                    legend: { fontSize: 18 },
                    plotOptions: { pie: { donut: { labels: { total: { fontSize: '3rem' }, value: { fontSize: '3rem' } } } } }
                }
            },
            {
                breakpoint: 3000,
                options: {
                    chart: { width: 600, height: 550 },
                    plotOptions: { pie: { donut: { labels: { total: { fontSize: '3rem' }, value: { fontSize: '3rem' } } } } }
                }
            },
        ]
    };


    return (
        <div className="flex justify-center content-center">
            <AppReactApexCharts type='donut' width='100%' series={data.value} options={options} />
        </div>
    )
}
