/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => [
    {
      source: '/',
      destination: '/vi/home',
      permanent: true,
      locale: false
    },
    {
      source: '/:lang(vi|en)',
      destination: '/:lang/home',
      permanent: true,
      locale: false
    },
    {
      source: '/((?!(?:vi:en|front-pages|favicon.ico)\\b)):path',
      destination: '/vi/:path',
      permanent: true,
      locale: false
    }
  ],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://soc.socjsc.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept- Version, Content - Length, Content - MD5, Content - Type, Date, X - Api - Version'
          }
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'soc.socjsc.com',
        port: '',
        pathname: '/assets/**'
      }
    ]
  },
  pageExtensions: ['ts', 'tsx'],
}

export default nextConfig
