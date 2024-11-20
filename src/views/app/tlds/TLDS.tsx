'use client'

import { useState } from "react"

import { Button, Card, CardContent, Grid, IconButton, InputAdornment, MenuItem, Typography } from "@mui/material"

import TLDSTableData from "@/components/tlds/TLDSTableData"
import CustomTextField from "@/@core/components/mui/TextField"
import { useDictionary } from "@/contexts/dictionaryContext"
import { TLDSStatus } from "@/data/items/tlds"

const TLDS = () => {
  const [searchText, setSearchText] = useState('')
  const [status, setStatus] = useState('all_status')
  const { dictionary } = useDictionary()

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <CustomTextField
                fullWidth
                value={searchText}
                onChange={(e: any) => {
                  setSearchText(e.target.value)
                }}
                placeholder={dictionary.search + '...'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {!!searchText && (
                        <IconButton edge='end' onClick={() => setSearchText('')} onMouseDown={(e: any) => e.preventDefault()}>
                          <i className='tabler-x' />
                        </IconButton>
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                fullWidth
                select
                value={status}
                onChange={(e: any) => {
                  setStatus(e.target.value)
                }}
                placeholder=''
              >
                <MenuItem value='all_status'>
                  <div className='flex flex-row gap-2 items-center'>
                    <div className='h-2 w-2 rounded-full' style={{ backgroundColor: '#678' }} />
                    <Typography>{dictionary.all_status}</Typography>
                  </div>
                </MenuItem>
                {TLDSStatus.map(status => (
                  <MenuItem key={status.label} value={status.label} >
                    <div className='flex flex-row gap-2 items-center'>
                      <div className='h-2 w-2 rounded-full' style={{ backgroundColor: status.color }} />
                      <Typography>{dictionary[status.label as keyof typeof dictionary]}</Typography>
                    </div>
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <TLDSTableData searchText={searchText} status={status} />
    </div>
  )
}

export default TLDS
