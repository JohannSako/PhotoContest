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
        ],
    },
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                "fs": false,
                "path": false,
                "os": false,
                "net": false,
                "tls": false
            }
        }
        return config;
    }
};

export default nextConfig;
