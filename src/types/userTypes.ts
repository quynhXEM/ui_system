import { DirectusUser } from '@directus/sdk'

export type UserType = {
  full_name?: string
  username?: string
} & DirectusUser
