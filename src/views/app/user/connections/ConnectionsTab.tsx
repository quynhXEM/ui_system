// MUI Imports
import { Grid, Avatar, Chip, Card, CardContent, Typography, Button } from '@mui/material'

// Type Imports
import type { ConnectionsTabType } from '@/types/pages/profileTypes'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import Link from '@components/Link'
import CustomIconButton from '@core/components/mui/IconButton'
import { useDictionary } from '@/contexts/dictionaryContext'

const ConnectionsTab = ({ data }: { data?: ConnectionsTabType[] }) => {
  const { dictionary } = useDictionary()

  return (
    <Grid container spacing={6}>
      {data &&
        data.map((item, index) => {
          return (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card className='relative'>
                <OptionMenu
                  iconClassName='text-textDisabled'
                  options={[
                    dictionary.share_connection,
                    dictionary.block_connection,
                    { divider: true },
                    {
                      text: dictionary.delete,
                      menuItemProps: { className: 'text-error hover:bg-[var(--mui-palette-error-lightOpacity)]' }
                    }
                  ]}
                  iconButtonProps={{ className: 'absolute top-6 end-5 text-textDisabled' }}
                />
                <CardContent className='flex items-center flex-col gap-6'>
                  <Avatar src={item.avatar} className='!mbs-5 bs-[100px] is-[100px]' />
                  <div className='flex flex-col items-center'>
                    <Typography variant='h5'>{item.name}</Typography>
                    <Typography>{item.designation}</Typography>
                  </div>
                  <div className='flex items-center gap-4'>
                    {item.chips.map((chip, index) => (
                      <Link key={index}>
                        <Chip variant='tonal' label={chip.title} color={chip.color} size='small' />
                      </Link>
                    ))}
                  </div>
                  <div className='flex is-full items-center justify-around flex-wrap'>
                    <div className='flex items-center flex-col'>
                      <Typography variant='h5'>{item.projects}</Typography>
                      <Typography>{dictionary.projects}</Typography>
                    </div>
                    <div className='flex items-center flex-col'>
                      <Typography variant='h5'>{item.tasks}</Typography>
                      <Typography>{dictionary.tasks}</Typography>
                    </div>
                    <div className='flex items-center flex-col'>
                      <Typography variant='h5'>{item.connections}</Typography>
                      <Typography>{dictionary.connections}</Typography>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Button
                      variant={item.isConnected ? 'contained' : 'tonal'}
                      startIcon={<i className={item.isConnected ? 'tabler-user-check' : 'tabler-user-plus'} />}
                    >
                      {item.isConnected ? dictionary.connected : dictionary.connect}
                    </Button>
                    <CustomIconButton variant='tonal' color='secondary'>
                      <i className='tabler-mail' />
                    </CustomIconButton>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
    </Grid>
  )
}

export default ConnectionsTab
