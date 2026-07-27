/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
      },
      {
        protocol: 'https',
        hostname: 'weather-visualizer.com',
      },
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;