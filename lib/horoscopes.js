// lib/horoscopes.js
// Günlük, haftalık, aylık yorumları çekme + Geçmiş arşiv

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

// ==================== GÜNLÜK YORUMLAR ====================

export function getDailyHoroscope(sign, date) {
  const filePath = path.join(contentDirectory, 'daily', `${date}-${sign}.md`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return {
    sign: data.sign,
    date: data.date,
    title: data.title,
    general: data.general,
    love: data.love,
    career: data.career,
    money: data.money,
    health: data.health,
    week: data.week,
    published: data.published
  };
}

// Tüm mevcut tarihleri listele (geçmiş arşiv için)
export function getAvailableDates() {
  const dailyDir = path.join(contentDirectory, 'daily');
  
  if (!fs.existsSync(dailyDir)) return [];
  
  const files = fs.readdirSync(dailyDir);
  
  const dates = [...new Set(
    files
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const parts = f.replace('.md', '').split('-');
        return `${parts[0]}-${parts[1]}-${parts[2]}`;
      })
  )].sort();
  
  return dates;
}

// Belirli bir burç için tüm günlük yorumları getir
export function getAllDailyForSign(sign) {
  const dailyDir = path.join(contentDirectory, 'daily');
  
  if (!fs.existsSync(dailyDir)) return [];
  
  const files = fs.readdirSync(dailyDir)
    .filter(f => f.includes(`-${sign}.md`))
    .sort();
  
  return files.map(file => {
    const filePath = path.join(dailyDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      sign: data.sign,
      date: data.date,
      title: data.title,
      general: data.general,
      published: data.published
    };
  }).filter(h => h.published !== false);
}

// ==================== HAFTALIK YORUMLAR ====================

export function getWeeklyHoroscope(sign, year, month, week) {
  const monthStr = String(month).padStart(2, '0');
  const filePath = path.join(contentDirectory, 'weekly', 
    `${year}-${monthStr}-w${week}-${sign}.md`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return {
    sign: data.sign,
    week: data.week,
    startDate: data.start_date,
    endDate: data.end_date,
    title: data.title,
    theme: data.theme,
    published: data.published
  };
}

// Aktif haftayı otomatik bul
export function getCurrentWeeklyHoroscope(sign, year, month) {
  const now = new Date();
  const day = now.getDate();
  
  let week = 1;
  if (day > 21) week = 4;
  else if (day > 14) week = 3;
  else if (day > 7) week = 2;
  
  return getWeeklyHoroscope(sign, year, month, week);
}

// ==================== AYLIK YORUMLAR ====================

export function getMonthlyHoroscope(sign, year, month) {
  const monthStr = String(month).padStart(2, '0');
  const filePath = path.join(contentDirectory, 'monthly', 
    `${year}-${monthStr}-${sign}.md`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return {
    sign: data.sign,
    month: data.month,
    year: data.year,
    title: data.title,
    theme: data.theme,
    weeks: [data.week1, data.week2, data.week3, data.week4],
    published: data.published
  };
}

// ==================== TÜM BURÇLAR İÇİN TOPLU ====================

export function getAllDailyHoroscopes(date) {
  const signs = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
                 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];
  
  return signs.map(sign => getDailyHoroscope(sign, date)).filter(Boolean);
}

export function getAllWeeklyHoroscopes(year, month, week) {
  const signs = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
                 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];
  
  return signs.map(sign => getWeeklyHoroscope(sign, year, month, week)).filter(Boolean);
}

export function getAllMonthlyHoroscopes(year, month) {
  const signs = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
                 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];
  
  return signs.map(sign => getMonthlyHoroscope(sign, year, month)).filter(Boolean);
}

// ==================== ARŞİV SAYFALARI İÇİN ====================

// Tüm ayları listele
export function getAvailableMonths() {
  const monthlyDir = path.join(contentDirectory, 'monthly');
  
  if (!fs.existsSync(monthlyDir)) return [];
  
  const files = fs.readdirSync(monthlyDir);
  
  const months = [...new Set(
    files
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const parts = f.split('-');
        return `${parts[0]}-${parts[1]}`;
      })
  )].sort().reverse();
  
  return months;
}

// Belirli bir ay için tüm burçları getir
export function getMonthArchive(year, month) {
  const monthStr = String(month).padStart(2, '0');
  const signs = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
                 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];
  
  return signs.map(sign => {
    const horoscope = getMonthlyHoroscope(sign, year, month);
    return horoscope ? { sign, ...horoscope } : null;
  }).filter(Boolean);
}
