export type TldsItemType = {
  id: string
  status: string
  name: string
  registrar: string | null
  policy_url: string | null
  pricing: TldsPricingType[]
}

export type TldsPricingType = {
  id: string
  tld_id: string
  type: string
  sale_price: string
  currency_id: string
  duration_unit: string
}
