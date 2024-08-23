/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["grammy"],
  },
  devIndicators: {
    appIsrStatus: true,
  },
};

export default nextConfig;
