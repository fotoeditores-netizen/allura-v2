// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-sanity", "sanity"],
  images: {
    domains: ["cdn.sanity.io"],
  },
};

export default withNextIntl(nextConfig);
