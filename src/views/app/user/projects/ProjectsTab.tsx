// MUI Imports
import { Grid, Chip, Card, CardContent, Typography, Divider, LinearProgress, AvatarGroup, Tooltip } from '@mui/material'

// Type Imports
import type { ProjectsTabType } from '@/types/pages/profileTypes'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import Link from '@components/Link'
import { useDictionary } from '@/contexts/dictionaryContext'

const ProjectsTab = ({ data }: { data?: ProjectsTabType[] }) => {
  const { dictionary } = useDictionary()

  return (
    <Grid container spacing={6}>
      {data &&
        data.map((item, index) => {
          return (
            <Grid item key={index} xs={12} md={6} lg={4}>
              <Card>
                <CardContent className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <CustomAvatar src={item.avatar} size={38} />
                      <div>
                        <Typography variant='h5' component={Link} className='hover:text-primary'>
                          {item.title}
                        </Typography>
                        <Typography>
                          <span className='font-medium'>Client: </span>
                          {item.client}
                        </Typography>
                      </div>
                    </div>
                    <OptionMenu
                      iconClassName='text-textDisabled'
                      options={[
                        dictionary.rename_project,
                        dictionary.view_detail,
                        dictionary.add_to_favourite,
                        { divider: true },
                        {
                          text: dictionary.leave_project,
                          menuItemProps: { className: 'text-error hover:bg-[var(--mui-palette-error-lightOpacity)]' }
                        }
                      ]}
                    />
                  </div>
                  <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div className='rounded bg-actionHover plb-2 pli-3'>
                      <div className='flex'>
                        <Typography className='font-medium' color='text.primary'>
                          {item.budgetSpent}
                        </Typography>
                        <Typography>{`/${item.budget}`}</Typography>
                      </div>
                      <Typography>{dictionary.total_budget}</Typography>
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex'>
                        <Typography className='font-medium' color='text.primary'>
                          {dictionary.start_date}:
                        </Typography>
                        <Typography> {item.startDate}</Typography>
                      </div>
                      <div className='flex'>
                        <Typography className='font-medium' color='text.primary'>
                          {dictionary.deadline}:
                        </Typography>
                        <Typography> {item.deadline}</Typography>
                      </div>
                    </div>
                  </div>
                  <Typography>{item.description}</Typography>
                </CardContent>
                <Divider />
                <CardContent className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between '>
                    <div className='flex'>
                      <Typography className='font-medium' color='text.primary'>
                        {dictionary.all_hours}:
                      </Typography>
                      <Typography>{item.hours}</Typography>
                    </div>
                    <Chip
                      variant='tonal'
                      size='small'
                      color={item.chipColor}
                      label={`${item.daysLeft} ${dictionary.days_left}`}
                    />
                  </div>
                  <div>
                    <div className='flex items-center justify-between mbe-2'>
                      <Typography
                        variant='caption'
                        className='text-textSecondary'
                      >{`${dictionary.tasks}: ${item.completedTask}/${item.totalTask}`}</Typography>
                      <Typography
                        variant='caption'
                        className='text-textSecondary'
                      >{`${Math.round((item.completedTask / item.totalTask) * 100)}% ${dictionary.completed}`}</Typography>
                    </div>
                    <LinearProgress
                      color='primary'
                      variant='determinate'
                      value={Math.round((item.completedTask / item.totalTask) * 100)}
                      className='bs-2'
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center flex-grow gap-3'>
                      <AvatarGroup className='items-center pull-up'>
                        {item.avatarGroup.map((person, index) => {
                          return (
                            <Tooltip key={index} title={person.name}>
                              <CustomAvatar src={person.avatar} alt={person.name} size={32} />
                            </Tooltip>
                          )
                        })}
                      </AvatarGroup>
                      <Typography variant='body2' className='flex-grow'>
                        {item.members} {dictionary.members}
                      </Typography>
                    </div>
                    <div className='flex items-center gap-1'>
                      <i className='tabler-message-dots' />
                      <Typography>{item.comments}</Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
    </Grid>
  )
}

export default ProjectsTab
