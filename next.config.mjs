/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["grammy"],
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
  },
};

export default nextConfig;
