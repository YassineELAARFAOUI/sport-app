/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  distDir: 'out', // Ensures the build output is in "out/"
  trailingSlash: true, // Fixes routing issues
};

export default nextConfig;
