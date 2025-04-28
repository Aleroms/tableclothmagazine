import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        pathname:
          "/png-clipart/20231005/original/pngtree-watercolor-snowman-winter-doll-png-image_13124071.png",
      },
      {
        protocol: "https",
        hostname: "tablecloth-magazine-local.s3.us-west-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
