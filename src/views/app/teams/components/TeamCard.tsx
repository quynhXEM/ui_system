import { useRouter } from 'next/navigation'

import { useParams } from 'next/dist/client/components/navigation'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classNames from 'classnames'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { TeamType } from '@/types/requestTypes'
import { useDictionary } from '@/contexts/dictionaryContext'

export default function TeamCard({ data }: { data: Array<TeamType> | undefined }) {
  const router = useRouter()
  const { dictionary } = useDictionary()
  const { lang: locale } = useParams()

  return (
    <>
      {
        data.map((item, index) => (
          <Grid key={index} item xs={12} md={4} sm={6} className='w-full'>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                <div className='flex justify-center p-4 rounded bg-primaryLight'>
                  <img
                    style={{ resize: 'block', width: '100%', height: '100%' }}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${item.logo}?fit=cover&width=300&height=200`}
                    srcSet={`${process.env.NEXT_PUBLIC_API_URL}/assets/${item.logo}?fit=cover&width=600&height=400 2x`}
                    alt='Logo'
                  />
                </div>
                <div>
                  <Typography variant='h5' className='mbe-2'>
                    {item.name}
                  </Typography>
                </div>
                <div className='flex flex-wrap justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <CustomAvatar variant='rounded' skin='light' color='primary'>
                      <i className={classNames('text-[28px]', 'tabler-brand-days-counter')} />
                    </CustomAvatar>
                    <div>
                      <Typography color='text.primary' className='font-medium'>
                        {item.date_created.toLocaleString().substring(0, 10)}
                      </Typography>
                      <Typography variant='body2'>{dictionary.start_date}</Typography>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <CustomAvatar variant='rounded' skin='light' color='primary'>
                      <i className={classNames('text-[28px]', 'tabler-users')} />
                    </CustomAvatar>
                    <div>
                      <Typography color='text.primary' className='font-medium'>
                        {item.members.length}
                      </Typography>
                      <Typography variant='body2'>{dictionary.members}</Typography>
                    </div>
                  </div>
                </div>
                <Button
                  variant='contained'
                  onClick={() => {
                    router.push(`/${locale}/teams/${item.id}`)
                  }}
                >
                  {dictionary.access}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      }
    </>
  )
}
