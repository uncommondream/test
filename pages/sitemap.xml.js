// pages/sitemap.xml.js
// Basit statik sitemap (hatasız)

const SITE_URL = 'https://astrologytoday.com';

export async function getServerSideProps({ res }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const signs = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
                 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Ana sayfa
  xml += '<url>';
  xml += '<loc>' + SITE_URL + '/</loc>';
  xml += '<lastmod>' + todayStr + 'T06:00:00+00:00</lastmod>';
  xml += '<changefreq>daily</changefreq>';
  xml += '<priority>1.0</priority>';
  xml += '</url>';
  
  // Günlük burç yorumları (sadece bugün)
  signs.forEach(sign => {
    xml += '<url>';
    xml += '<loc>' + SITE_URL + '/gunluk/' + todayStr + '/' + sign + '/</loc>';
    xml += '<lastmod>' + todayStr + 'T06:00:00+00:00</lastmod>';
    xml += '<changefreq>daily</changefreq>';
    xml += '<priority>0.9</priority>';
    xml += '</url>';
  });
  
  xml += '</urlset>';
  
  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();
  
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
