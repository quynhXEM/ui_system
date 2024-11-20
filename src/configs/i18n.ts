export const i18n = {
  defaultLocale: 'vi',
  locales: ['vi', 'en'],
  langDirection: {
    vi: 'ltr',
    en: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
