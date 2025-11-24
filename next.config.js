/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  output: 'export',
  basePath: isGithubActions ? '/creativ_connect' : '',
  assetPrefix: isGithubActions ? 'https://erwans2003.github.io/creativ_connect/' : '',
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
    unoptimized: true, // Nécessaire pour l'export statique
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
