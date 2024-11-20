// @Context Imports
import { DictionaryProvider } from '@/contexts/dictionaryContext'
import { getDictionary } from '@/utils/getDictionary'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

type Props = ChildrenType & { params: { lang: Locale } }

const Layout = async ({ children, params }: Props) => {
  // Vars
  const dictionary = await getDictionary(params.lang)

  return <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
}

export default Layout
