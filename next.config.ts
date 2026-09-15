import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default withPayload(nextConfig);
