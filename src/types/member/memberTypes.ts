export type UserItemType = {
  user_id: MemberItemType
}

export type MemberItemType = {
  username: string
  middle_name: string
  full_name: string
  birthday: string | null
  gender: string | null
  country_code: string | null
  phone: string | null
  email_verified: boolean
  phone_verified: boolean
  referrer_id: string
  email_notifications: boolean
  token: string
  date_updated: string
  date_created: string
  telegram_id: string | null
  avatar: string | null
  status: string
  id: string
  last_name: string
  first_name: string
  email: string
  password: string
  location: string | null
  title: string | null
  description: string | null
  tags: string | null
  language: string
  tfa_secret: string | null
  appearance: string | null
  theme_light: string | null
  theme_dark: string | null
  role: string
  last_page: string
  teams: number[]
}
