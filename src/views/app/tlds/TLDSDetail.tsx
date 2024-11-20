'use client'

import { useCallback, useEffect, useRef, useState } from "react"

import { useParams } from "next/navigation"

import { readItem } from "@directus/sdk"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

import { useDirectus } from "@/contexts/directusProvider"
import TLDSForm, { TLDSFormData, TLDSFormHandle } from "@/components/tlds/TLDSForm"

const TLDSDetail = () => {
  const [data, setData] = useState<TLDSFormData>()
  const { directusRequest } = useDirectus()
  const { id } = useParams()
  const tldsFormRef = useRef<TLDSFormHandle>(null)

  const getData = useCallback(async () => {
    const tldsAPI = await directusRequest(readItem('tlds', id, { fields: ["*", "pricing.*"] }))

    if (tldsAPI) {
      setData(tldsAPI)
    }
  }, [directusRequest, id])

  useEffect(() => {
    getData()
  }, [getData])

  const onSubmit = () => {
    // TODO
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        {!!data && <TLDSForm ref={tldsFormRef} onSubmit={onSubmit} initFormData={data} />}
      </CardContent>
    </Card>
  )
}

export default TLDSDetail
