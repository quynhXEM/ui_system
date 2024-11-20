import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

import { Autocomplete, Button, Card, Checkbox, Collapse, FormControlLabel, Modal, Paper, Switch, TextField, Typography } from '@mui/material'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

import { useDictionary } from '@/contexts/dictionaryContext'

const websites: string[] = [
  'LuaSpa.vn',
  'LuckyMoney.games',
  'MayDongPhucGiaSi.com',
  'MySuperMarket.io',
  'PinkBears.win',
  'Presale.Nobody.network',
]

const wallets = [
  { name: "Ví mặc định", icon: "💵" },
  { name: "Quỹ dự phòng", icon: "📔" },
  { name: "Quỹ giáo dục", icon: "🎓" },
  { name: "Quỹ đầu tư", icon: "🌱" },
  { name: "Quỹ ăn chơi", icon: "🍹" },
  { name: "Quỹ từ thiện", icon: "🧑‍🤝‍🧑" },
  { name: "Tài khoản công ty", icon: "🏦" }
];

const shows = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
]



interface props {
  onCloseModal: () => void
  openModalAddTransaction: boolean
}

const ModalAddTransaction = (props: props) => {
  const { dictionary } = useDictionary();
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  const [teams, setTeams] = useState<string | null>('')
  const [wallet, setWallet] = useState<string | undefined>('')
  const [money, setmoney] = useState<string>('')
  const [date, setDate] = useState<Dayjs | null>(null);
  const [note, setNote] = useState<string>('')
  const [project, setProject] = useState<string | null>('')
  const [pay, setPay] = useState<string | null>('')
  const [selectedShows, setSelectedShows] = useState<any>([]);

  // Hàm xử lý khi người dùng chọn tệp
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Kiểm tra nếu có tệp nào được chọn

    if (file) {
      console.log("Selected file:", file);
    }
  };

  const handleShowAdvanced = () => {
    setShowAdvanced(!showAdvanced)
  }

  return (
    <Modal open={props.openModalAddTransaction}>
      <div className='w-full h-full flex justify-center items-center'>
        <Paper className='relative' style={{ width: 850 }}>
          <div className='flex flex-row justify-between items-center p-4 bg-blue-700 rounded-t-md'>
            <Typography className='text-white font-bold text-base'>{dictionary.add_transaction}</Typography>
            <i className='tabler-x text-white' onClick={props.onCloseModal} />
          </div>
          <div className='p-4'>
            <Card className='pr-4 py-4'>
              <div className='w-full flex items-center flex-col md:flex-row'>
                <div className='w-full flex flex-row items-center'>
                  <div className='flex flex-row justify-center py-2 mx-3 w-24 rounded-md'>
                    <Typography className='font-semibold'>{dictionary.amount}</Typography>
                    <span className='text-red-600 text-base'>*</span>
                  </div>
                  <TextField id="outlined-basic" className='w-full' sx={{
                    height: '40px', // Adjust the height of the input
                    '& .MuiInputBase-root': {
                      height: '40px', // Height of the input field
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'right', // Align text to the right
                    }
                  }}
                    onChange={(e) => setmoney(e.target.value)}
                  />
                </div>
                <div className='w-full flex flex-row items-center mt-4 md:mt-0'>
                  <div className='flex flex-row justify-center py-2 mx-3 w-24 rounded-md'>
                    <Typography className='font-semibold'>{dictionary.date}</Typography>
                    <span className='text-red-600 text-base'>*</span>
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={date}
                      onChange={(e) => setDate(e)}
                      className='w-full' sx={{
                        height: '40px', // Adjust the height of the input
                        '& .MuiInputBase-root': {
                          height: '40px', // Height of the input field
                        },
                      }} />
                  </LocalizationProvider>
                </div>
              </div>

              <div className='w-full flex items-center flex-col mt-4 md:flex-row'>
                <div className='w-full flex flex-row items-center'>
                  <div className='flex flex-row justify-center py-2 mx-3 w-24 rounded-md'>
                    <Typography className='font-semibold'>{dictionary.teams}</Typography>
                  </div>
                  <Autocomplete
                    disablePortal
                    options={websites}
                    sx={{ width: "100%" }}
                    onChange={(e, value) => setTeams(value)}
                    renderInput={(params) => <TextField {...params} placeholder={"--" + dictionary.select_a_value + "--"} sx={{
                      height: '40px', // Adjust the height of the input
                      '& .MuiInputBase-root': {
                        height: '40px', // Height of the input field
                      },
                    }}
                    />}
                  />
                </div>
                <div className='w-full flex flex-row items-center mt-4 md:mt-0'>
                  <div className='flex flex-row justify-center py-2 mx-3 w-24 rounded-md'>
                    <Typography className='font-semibold'>{dictionary.wallet}</Typography>
                    <span className='text-red-600 text-base'>*</span>
                  </div>

                  <Autocomplete
                    disablePortal
                    options={wallets}
                    getOptionLabel={(option) => `${option.icon} ${option.name}`}
                    defaultValue={wallets[0]}
                    className='w-full'
                    onChange={(e, value) => setWallet(value?.name)}
                    renderInput={(params) => <TextField {...params} placeholder='--Chọn ví--' sx={{
                      height: '40px', // Adjust the height of the input
                      '& .MuiInputBase-root': {
                        height: '40px', // Height of the input field
                      },
                    }}
                    />}
                    renderOption={(props, option) => (
                      <li {...props} style={{ color: 'blue', fontWeight: 'bold' }}>
                        {/* Custom content for each option */}
                        <div className='flex flex-row items-center'>
                          <span>{option.icon}</span> {/* or any other field you want */}
                          <Typography className='font-semibold'>{option.name}</Typography> {/* Example: add a description */}
                        </div>
                      </li>
                    )}
                  />
                </div>
              </div>
              <div className='w-full mt-4 flex flex-row'>
                <div className='flex flex-row justify-center py-2 mx-3 w-24 md:w-20 rounded-md'>
                  <Typography className='font-semibold'>{dictionary.note}</Typography>
                </div>
                <div className='relative w-full'>
                  <TextField
                    variant="outlined"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú"
                    className='w-full'
                    sx={{
                      height: '40px', // Adjust the height of the input
                      '& .MuiInputBase-root': {
                        height: '40px', // Height of the input field
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    className='absolute z-10 right-0'
                    sx={{ height: '100%', borderLeft: 0 }} // Adjust size as needed
                  >
                    Tải lên
                    <input
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                </div>
              </div>
            </Card>
            <Button className='w-full p-3 my-3 bg-blue-600' onClick={handleShowAdvanced}>
              <Typography className='text-white'>{dictionary.advanced}</Typography>
            </Button>
            <Collapse in={showAdvanced}>
              <Card className='border-b-2 border-gray-200 pr-4 py-4'>
                <div className='w-full flex items-center flex-col md:flex-row'>
                  <div className='w-full flex flex-row items-center'>
                    <div className='flex flex-row justify-center py-2 mx-3 w-40 rounded-md '>
                      <Typography className='font-semibold'>{dictionary.project}</Typography>
                    </div>
                    <Autocomplete
                      disablePortal
                      options={websites}
                      value={project}
                      onChange={(e, value) => setProject(value)}
                      sx={{ width: "100%" }}
                      renderInput={(params) => <TextField {...params} placeholder='--Chọn một giá trị--' sx={{
                        height: '40px', // Adjust the height of the input
                        '& .MuiInputBase-root': {
                          height: '40px', // Height of the input field
                        },
                      }}
                      />}
                    />
                  </div>
                  <div className='w-full flex flex-row items-center mt-4 md:mt-0'>
                    <div className='flex flex-row justify-center py-2 mx-3 w-40 rounded-md '>
                      <Typography className='font-semibold'>{dictionary.pay}</Typography>
                    </div>

                    <Autocomplete
                      disablePortal
                      options={websites}
                      value={pay}
                      onChange={(e, value) => setPay(value)}
                      sx={{ width: "100%" }}
                      renderInput={(params) => <TextField {...params} placeholder='--Chọn một giá trị--' sx={{
                        height: '40px', // Adjust the height of the input
                        '& .MuiInputBase-root': {
                          height: '40px', // Height of the input field
                        },
                      }}
                      />}
                    />
                  </div>
                </div>
                <div className='w-full my-4 flex flex-row'>
                  <div className='flex flex-row justify-center py-2 mx-3 w-40 md:w-32 rounded-md'>
                    <Typography className='font-semibold'>{dictionary.show_for}</Typography>
                  </div>
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={shows}
                    getOptionLabel={(option) => option.title}
                    className='w-full'
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      setSelectedShows(newValue); // Cập nhật state
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                      />
                    )}
                  />
                </div>
                <div className='w-full mt-4 flex flex-row'>
                  <div className='flex flex-row justify-center items-center mx-3 w-32 rounded-md'>
                    <Typography className='font-semibold'>{dictionary.setting}</Typography>
                  </div>
                  <div className='w-full'>
                    <FormControlLabel control={<Switch defaultChecked />} label="Tính vào số dư" />
                  </div>
                </div>
              </Card>
            </Collapse>
          </div>
          <div className=' flex flex-row justify-between items-center py-5 px-4'>
            <Button>
              <Typography className='font-bold text-base'>{dictionary.cancel}</Typography>
            </Button>
            <Button className=' flex items-center bg-blue-700' >
              <Typography className='text-white text-sm'>{dictionary.add_transaction}</Typography>
            </Button>
          </div>
        </Paper>
      </div >
    </Modal >
  )
}

export default ModalAddTransaction
