import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: "https",
            hostname: 'png.pngtree.com',
            pathname: '/png-clipart/20231005/original/pngtree-watercolor-snowman-winter-doll-png-image_13124071.png'
        }
    ]
  },
};

export default nextConfig;
