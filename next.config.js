/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  publicRuntimeConfig: {
    DOMAIN_CLIENT: process.env.DOMAIN_CLIENT || 'http://localhost:3000',
    DOMAIN_DATALAYER: process.env.DOMAIN_DATALAYER || 'http://localhost:3001',
    DOMAIN_POPUP: process.env.DOMAIN_POPUP || 'http://localhost:3002'
  }
};

module.exports = nextConfig;
