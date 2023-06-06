/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/twitch/:path*',
            destination: '/api/twitch/:path*',
          },
        ];
      },
}

module.exports = nextConfig
