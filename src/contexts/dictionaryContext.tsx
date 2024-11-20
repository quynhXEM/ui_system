'use client'

// React Imports
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

type DictionaryContextProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

const DictionaryContext = createContext<DictionaryContextProps | null>(null)

export const DictionaryProvider = ({
  children,
  dictionary
}: {
  children: ReactNode
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}) => {
  return <DictionaryContext.Provider value={{ dictionary }}>{children}</DictionaryContext.Provider>
}

export const useDictionary = () => {
  const context = useContext(DictionaryContext)

  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider')
  }

  return context
}
