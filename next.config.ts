/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "psrgxziiqjicfvevdaaw.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/store-images/**",
      },
    ],
  },
}

module.exports = nextConfig