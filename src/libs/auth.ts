import { AuthOptions, DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { login, withToken, refresh, readMe } from '@directus/sdk'

import directus from '@/libs/directus'

let isRefesh: boolean
let refesdataa: any

const refreshAccessToken = async (token: any) => {
  isRefesh = true

  // console.info('token truyen vao', token?.refresh_token)

  const refreshAPI = await directus.request(refresh('json', refesdataa?.refresh_token || token.refresh_token))

  return { ...token, ...(refreshAPI || {}), tokenExpire: Date.now() + refreshAPI?.expires - 50000 }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        try {
          // Login API
          const loginAPI = await directus.request(login(email, password, { mode: 'json' }))

          if (loginAPI && loginAPI.access_token) {
            // Get user profile
            const getProfileAPI = await directus.request(withToken(loginAPI.access_token, readMe()))

            return { ...loginAPI, ...getProfileAPI }
          } else {
            return null
          }
        } catch (err) {
          console.log('---- ERROR credentials', err)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/vi/home'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial Login
      if (account && user) {
        // console.info('login')

        return { ...token, ...account, ...user, tokenExpire: Date.now() + user.expires - 50000 }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.tokenExpire) {
        refesdataa = null

        // console.info('token con han', token?.refresh_token, 'tokendata', refesdataa)

        return token
      }

      if (isRefesh) {
        // console.info('Dang làm mới token đây là token trả về ', refesdataa?.refresh_token)

        return refesdataa
      }

      try {
        // console.info('token het han', token?.refresh_token)
        // console.info('token dang luu ', refesdataa?.refresh_token)

        const expired = await refreshAccessToken(token)

        refesdataa = expired

        // console.info('refesh thanh coong ', expired?.refresh_token, refesdataa?.refresh_token)

        return expired
      } catch (error) {
        console.error('refesh token faild, tra ve token dang luu', refesdataa?.refresh_token)

        return refesdataa
      } finally {
        isRefesh = false
      }

      // Access token has expired, try to update it
    },
    async session({ session, token, user }) {
      console.info('Token lưu cuối cùng :', token?.refresh_token)

      session.user = { ...token } as any

      // session.maxAge = token['maxAge'] as number // Use maxAge from token
      // session.expires = new Date(Date.now() + token.maxAge * 1000).toISOString()

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      access_token: string
      refresh_token: string
      email: string
      full_name: string
    } & DefaultSession['user']
  }
}
