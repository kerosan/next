/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["grammy"],
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    return config;
  },
};

export default nextConfig;
