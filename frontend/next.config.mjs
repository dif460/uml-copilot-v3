/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
    return [
      {
        source: "/api/langgraph/:path*",
        destination: "http://localhost:2024/:path*",
      },
      {
        source: "/api/import/:path*",
        destination: "http://localhost:8000/api/import/:path*",
      },
    ];
  },
};
export default nextConfig;
