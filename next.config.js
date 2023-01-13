/** @type {import('next').NextConfig} */
const withoutCSSImport = require("next-remove-imports")();

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

module.exports = withoutCSSImport({
  ...nextConfig,
})