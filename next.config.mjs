import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias["@/lib"] = path.resolve(process.cwd(), "lib");
    config.resolve.alias["@/components"] = path.resolve(process.cwd(), "components");
    config.resolve.alias["@/data"] = path.resolve(process.cwd(), "data");
    return config;
  },
};

export default nextConfig;
