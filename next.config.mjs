/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server build (.next/standalone) for a lean Docker image.
  output: "standalone",
};

export default nextConfig;
