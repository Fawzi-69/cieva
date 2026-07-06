/** @type {import('next').NextConfig} */
// BASE_PATH sert au déploiement sous un sous-chemin (ex. GitHub Pages /cieva).
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
