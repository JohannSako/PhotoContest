/** @type {import('next').NextConfig} */
const nextConfig = {
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
    }
};

export default nextConfig;
