/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendBaseUrl =
      process.env.BACKEND_BASE_URL?.replace(/\/+$/, "") ?? "http://localhost:8080";

    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
