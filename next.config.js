/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  // Statik export için dynamic route'ları generate etme
  // Bu ayar olmadan [date]/[sign] gibi dynamic route'lar build hatası verir
}

module.exports = nextConfig
