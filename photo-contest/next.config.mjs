/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    swSrc: 'service-worker.js'
})(
    {
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: '**.pinimg.com',
                    port: '',
                    pathname: '/**',
                },
                {
                    protocol: 'https',
                    hostname: '**.cloudinary.com',
                    port: '',
                    pathname: '/**',
                },
            ],
        },
        webpack: (config) => {
            return config;
        },
    }
);

export default nextConfig;