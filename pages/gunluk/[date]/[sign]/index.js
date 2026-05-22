// pages/gunluk/[date]/[sign].js
// Statik export uyumlu günlük burç sayfası

import Link from 'next/link';
import { getDailyHoroscope } from '../../../lib/horoscopes';
import { getDailyPaths } from '../../../lib/staticPaths';

export default function DailyHoroscopePage({ horoscope, currentDate, allDates, allSigns }) {
  if (!horoscope) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Yorum Bulunamadı</h1>
        <p>Bu tarih için burç yorumu henüz eklenmemiş.</p>
        <Link href="/" className="text-purple-600 mt-4 inline-block">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const burcIsimleri = {
    koc: 'Koç', boga: 'Boğa', ikizler: 'İkizler', yengec: 'Yengeç',
    aslan: 'Aslan', basak: 'Başak', terazi: 'Terazi', akrep: 'Akrep',
    yay: 'Yay', oglak: 'Oğlak', kova: 'Kova', balik: 'Balık'
  };

  const dateObj = new Date(currentDate);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": horoscope.title,
          "datePublished": `${currentDate}T06:00:00+03:00`,
          "dateModified": `${currentDate}T06:00:00+03:00`,
          "author": { "@type": "Organization", "name": "Astrology Today" },
          "articleSection": "Burç Yorumları",
          "keywords": `${horoscope.sign} burcu, günlük yorum, ${formattedDate}`
        })
      }} />

      <h1 className="text-3xl font-bold mb-2">{horoscope.title}</h1>
      <p className="text-gray-600 mb-6">{formattedDate}</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🌟 Genel Yorum</h2>
        <p className="text-lg leading-relaxed">{horoscope.general}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-pink-50 rounded-lg p-4">
          <h3 className="font-semibold text-pink-700 mb-2">💕 Aşk</h3>
          <p>{horoscope.love || 'Bugün aşk hayatınızda denge önemli.'}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-700 mb-2">💼 Kariyer</h3>
          <p>{horoscope.career || 'İş hayatında pratik çözümler üretin.'}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-700 mb-2">💰 Para</h3>
          <p>{horoscope.money || 'Finansal konularda dikkatli olun.'}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-700 mb-2">🏥 Sağlık</h3>
          <p>{horoscope.health || 'Düzenli beslenme ve su tüketimine özen gösterin.'}</p>
        </div>
      </div>

      {/* GEÇMİŞ ARŞİV */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">📅 Geçmiş Yorumlar - {burcIsimleri[horoscope.sign]} Burcu</h2>
        <div className="flex flex-wrap gap-2">
          {allDates.map((date) => (
            <Link 
              key={date}
              href={`/gunluk/${date}/${horoscope.sign}/`}
              className={`px-3 py-2 rounded text-sm ${
                date === currentDate 
                  ? 'bg-purple-600 text-white font-bold' 
                  : 'bg-gray-100 hover:bg-purple-100'
              }`}
            >
              {new Date(date).getDate()}
            </Link>
          ))}
        </div>
      </div>

      {/* DİĞER BURÇLAR */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">🔮 Diğer Burçlar - {formattedDate}</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {allSigns.map((sign) => (
            <Link
              key={sign}
              href={`/gunluk/${currentDate}/${sign}/`}
              className={`text-center p-3 rounded capitalize ${
                sign === horoscope.sign 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 hover:bg-purple-50'
              }`}
            >
              {burcIsimleri[sign]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Statik export için TÜM path'leri build zamanında oluştur
export async function getStaticPaths() {
  const paths = getDailyPaths();

  return {
    paths,
    fallback: false // Olmayan sayfa 404
  };
}

export async function getStaticProps({ params }) {
  const { date, sign } = params;

  const horoscope = getDailyHoroscope(sign, date);
  const allDates = getAvailableDates();
  const allSigns = getAllSigns();

  return {
    props: {
      horoscope,
      currentDate: date,
      allDates,
      allSigns
    }
  };
}
