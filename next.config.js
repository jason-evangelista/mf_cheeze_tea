/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/sign-in",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
