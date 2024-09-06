/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["grammy"],
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
        ".graphql",
        ".gql",
      ],
      rules: {
        "*.graphql": {
          loaders: ["graphql-tag/loader"],
          as: "*.js",
        },
        "*.gql": {
          loaders: ["graphql-tag/loader"],
          as: "*.js",
        },
      },
    },
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
  },
  webpack: (config, options) => {
    // config.infrastructureLogging = { debug: /PackFileCache/ };

    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    return config;
  },
};

export default nextConfig;
