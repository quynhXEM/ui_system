import { SyntheticEvent, useEffect, useState } from "react"

import { useParams } from "next/navigation"

import { readItems, withToken } from "@directus/sdk"

import { TabContext, TabList, TabPanel } from "@mui/lab"

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Typography } from "@mui/material"

import { useDictionary } from "@/contexts/dictionaryContext"
import directus from "@/libs/directus"

type PoliciesDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const PoliciesDialog = ({ isOpen, onClose }: PoliciesDialogProps) => {
  const { dictionary } = useDictionary()
  const [policies, setPolicies] = useState<any[]>([])
  const { lang } = useParams()
  const [tab, setTab] = useState<string>('')


  useEffect(() => {
    getPolicies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const getPolicies = async () => {
    const policiesAPI = await directus.request(withToken(process.env.NEXT_PUBLIC_DEV_STATIC_TOKEN || '', readItems('policies', {
      fields: ['*', "translations.*"],
      filter: {
        "website_id": {
          "_eq": process.env.NEXT_PUBLIC_WEBSITE_ID
        }
      },
      deep: {
        "translations": {
          "_filter": {
            "language_code": lang === 'vi' ? "vi-VN" : 'en-US'
          }
        }
      }
    })))

    if (policiesAPI && Array.isArray(policiesAPI)) {
      setPolicies(policiesAPI)
      setTab(policiesAPI[0]?.type)
    }
  }

  const onChangeTab = (e: SyntheticEvent, newTab: string) => {
    setTab(newTab)
  }

  return (
    <Dialog
      open={isOpen}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle id='alert-dialog-title'>{dictionary["terms_&_policies"]}</DialogTitle>
      <DialogContent className="grid overflow-hidden">
        <TabContext value={tab}>
          <TabList variant='fullWidth' onChange={onChangeTab} aria-label='policies tabs'>
            {policies.map(tab => (
              <Tab key={tab.id} value={tab.type} label={tab?.translations?.[0]?.title ?? ''} />
            ))}
          </TabList>
          {policies.map(tab => (
            <TabPanel key={tab.id} value={tab.type} className="overflow-auto">
              <Typography className="font-semibold mb-2">
                {tab?.translations?.[0]?.description ?? ''}
              </Typography>
              <Typography dangerouslySetInnerHTML={{ __html: tab?.translations?.[0]?.content ?? '' }} />
            </TabPanel>
          ))}
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose}>
          {dictionary.close}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PoliciesDialog
