export const getCountryCode = async (ip?: string) => {
  try {
    const countryResponse = await fetch(`https://api.country.is/` + (ip || ''))
    const countryCode = await countryResponse.json()

    console.log('----countryCode', countryCode)

    return countryCode?.country ?? 'VN'
  } catch (error) {
    console.error('Error fetching user country:', error)

    return 'VN'
  }
}
