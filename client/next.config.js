/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_HOST: process.env.API_HOST,
        API_PORT: process.env.API_PORT,
        POLLS_NAMESPACE: process.env.POLLS_NAMESPACE,
    }
}

module.exports = nextConfig
