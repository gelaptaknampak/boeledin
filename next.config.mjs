/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wp.boeledin.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
