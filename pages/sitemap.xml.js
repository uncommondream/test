// pages/sitemap.xml.js
// Her gün otomatik güncellenen sitemap

import { getAvailableDates, getAvailableMonths } from '../lib/horoscopes';

const SITE_URL = 'https://astrologytoday.com';

function generateSitemap() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const dates = getAvailableDates();
  const months = getAvailableMonths();

  const signs = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
                 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];

  let urls = [];

  // Ana sayfa
  urls.push({
    loc: SITE_URL,
    lastmod: todayStr,
    changefreq: 'daily',
    priority: '1.0'
  });

  // Günlük burç yorumları (her tarih ve burç kombinasyonu)
  dates.forEach(date => {
    signs.forEach(sign => {
      urls.push({
        loc: `${SITE_URL}/gunluk/${date}/${sign}`,
        lastmod: date,
        changefreq: 'daily',
        priority: date === todayStr ? '0.9' : '0.6'
      });
    });
  });

  // Aylık arşiv sayfaları
  months.forEach(month => {
    const [year, monthNum] = month.split('-');
    signs.forEach(sign => {
      urls.push({
        loc: `${SITE_URL}/aylik/${year}/${monthNum}/${sign}`,
        lastmod: `${month}-01`,
        changefreq: 'monthly',
        priority: '0.7'
      });
    });
  });

  // Blog ve sabit sayfalar
  urls.push({
    loc: `${SITE_URL}/blog`,
    lastmod: todayStr,
    changefreq: 'weekly',
    priority: '0.8'
  });

  // XML oluştur
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}T06:00:00+00:00</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('
')}
</urlset>`;

  return xml;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSitemap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
