/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@remotion/renderer",
      "remotion",
      "fluent-ffmpeg",
      "@ffmpeg-installer/ffmpeg",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push(
        "@remotion/renderer",
        "fluent-ffmpeg",
        "@ffmpeg-installer/ffmpeg"
      );
    }
    return config;
  },
  serverRuntimeConfig: {
    maxDuration: 60,
  },
};

export default nextConfig;
