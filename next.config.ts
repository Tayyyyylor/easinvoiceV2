import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Keep a running development server independent from production builds.
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    transpilePackages: ['@react-pdf/renderer'],
    experimental: {
        serverActions: { bodySizeLimit: '4mb' },
    },
}

export default nextConfig
