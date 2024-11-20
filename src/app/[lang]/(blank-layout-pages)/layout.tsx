// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'

// @Context Imports
import { DictionaryProvider } from '@/contexts/dictionaryContext'

type Props = ChildrenType & { params: { lang: Locale } }

const Layout = async ({ children, params }: Props) => {
  // Vars
  const direction = i18n.langDirection[params.lang]
  const dictionary = await getDictionary(params.lang)
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <DictionaryProvider dictionary={dictionary}>
        <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
      </DictionaryProvider>
    </Providers>
  )
}

export default Layout
