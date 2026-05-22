// pages/index.js
// Ana sayfa - Bugünün tüm burç yorumları + Arşiv

import Link from 'next/link';
import { getAllDailyHoroscopes, getAvailableDates, getAvailableMonths } from '../lib/horoscopes';

export default function HomePage({ todayHoroscopes, availableDates, availableMonths, todayStr }) {
  const burcIsimleri = {
    koc: 'Koç', boga: 'Boğa', ikizler: 'İkizler', yengec: 'Yengeç',
    aslan: 'Aslan', basak: 'Başak', terazi: 'Terazi', akrep: 'Akrep',
    yay: 'Yay', oglak: 'Oğlak', kova: 'Kova', balik: 'Balık'
  };

  const todayFormatted = new Date(todayStr).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Astrology Today",
          "url": "https://astrologytoday.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://astrologytoday.com/ara?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Başlık */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🔮 Astrology Today</h1>
        <p className="text-xl text-gray-600">Günlük Burç Yorumları</p>
        <p className="text-lg text-purple-600 font-semibold mt-2">{todayFormatted}</p>
      </header>

      {/* Bugünün Yorumları */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Bugünün Burç Yorumları</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todayHoroscopes.map((horoscope) => (
            <Link 
              key={horoscope.sign}
              href={`/gunluk/${todayStr}/${horoscope.sign}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold capitalize">{burcIsimleri[horoscope.sign]}</h3>
                <span className="text-2xl">
                  {horoscope.sign === 'koc' && '♈'}
                  {horoscope.sign === 'boga' && '♉'}
                  {horoscope.sign === 'ikizler' && '♊'}
                  {horoscope.sign === 'yengec' && '♋'}
                  {horoscope.sign === 'aslan' && '♌'}
                  {horoscope.sign === 'basak' && '♍'}
                  {horoscope.sign === 'terazi' && '♎'}
                  {horoscope.sign === 'akrep' && '♏'}
                  {horoscope.sign === 'yay' && '♐'}
                  {horoscope.sign === 'oglak' && '♑'}
                  {horoscope.sign === 'kova' && '♒'}
                  {horoscope.sign === 'balik' && '♓'}
                </span>
              </div>
              <p className="text-gray-700 line-clamp-3">{horoscope.general}</p>
              <span className="text-purple-600 text-sm mt-4 inline-block">Devamını oku →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* GEÇMİŞ ARŞİV */}
      <section className="mb-16 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">📅 Geçmiş Yorumlar Arşivi</h2>

        {/* Son 7 gün */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Son Günler</h3>
          <div className="flex flex-wrap gap-2">
            {availableDates.slice(-7).map(date => (
              <Link
                key={date}
                href={`/gunluk/${date}`}
                className={`px-4 py-2 rounded-full text-sm ${
                  date === todayStr 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 hover:bg-purple-100'
                }`}
              >
                {new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              </Link>
            ))}
          </div>
        </div>

        {/* Aylık Arşiv */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Aylık Arşiv</h3>
          <div className="flex flex-wrap gap-2">
            {availableMonths.map(month => {
              const [year, monthNum] = month.split('-');
              const date = new Date(year, monthNum - 1);
              return (
                <Link
                  key={month}
                  href={`/aylik/${year}/${monthNum}`}
                  className="px-4 py-2 rounded-full text-sm bg-gray-100 hover:bg-purple-100"
                >
                  {date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm border-t pt-8">
        <p>© 2026 Astrology Today. Tüm hakları saklıdır.</p>
        <div className="mt-4 space-x-4">
          <Link href="/hakkimizda" className="hover:text-purple-600">Hakkımızda</Link>
          <Link href="/iletisim" className="hover:text-purple-600">İletişim</Link>
          <Link href="/gizlilik" className="hover:text-purple-600">Gizlilik Politikası</Link>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const todayHoroscopes = getAllDailyHoroscopes(todayStr);
  const availableDates = getAvailableDates();
  const availableMonths = getAvailableMonths();

  return {
    props: {
      todayHoroscopes,
      availableDates,
      availableMonths,
      todayStr
    },
    // ISR: Her 24 saatte bir yeniden oluştur
    revalidate: 86400
  };
}
