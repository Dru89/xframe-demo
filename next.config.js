/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  publicRuntimeConfig: {
    DOMAIN_CLIENT: process.env.DOMAIN_CLIENT || 'localhost:3000',
    DOMAIN_DATALAYER: process.env.DOMAIN_DATALAYER || 'localhost:3001',
    DOMAIN_POPUP: process.env.DOMAIN_POPUP || 'localhost:3002'
  }
};

module.exports = nextConfig;
