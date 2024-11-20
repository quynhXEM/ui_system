'use client'

import { useState } from "react"

import { Card, Grid } from "@mui/material"

import CashFlow from "@/views/app/financial-report/charts/CashFlow"
import TimeDropdown from "@/views/app/financial-report/filter/TimeDropdown"
import WalletDropdown from "@/views/app/financial-report/filter/WalletDropdown"

const FinancailReportPage = () => {
    const [timeRange, setTimeRange] = useState<String>("Toàn bộ")

    return (
        <>
            <Grid item xs={12}>
                <Card className="p-5 mb-5 flex flex-wrap justify-between ">
                    <TimeDropdown setTimeRange={setTimeRange} />
                    <WalletDropdown />
                </Card>
            </Grid>
            <CashFlow timerange={timeRange} />
        </>
    )
}

export default FinancailReportPage
