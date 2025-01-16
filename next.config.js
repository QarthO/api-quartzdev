/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/twitch/:path*",
        destination: "/api/twitch/:path*",
      },
      {
        source: "/discord/:path*",
        destination: "/api/discord/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
