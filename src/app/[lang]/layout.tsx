// Next Imports
import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-toastify/dist/ReactToastify.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@/configs/i18n'

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Config Imports
import { i18n } from '@/configs/i18n'
import LocaleProvider from '@/contexts/LocaleProvider'

export const metadata = {
  title: 'Work My Job',
  description: 'Work My Job'
}

const RootLayout = async ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  const direction = i18n.langDirection[params.lang]
  const headersList = headers()

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction}>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <LocaleProvider>{children}</LocaleProvider>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
