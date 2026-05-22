// lib/staticPaths.js
// Statik export için tüm path'leri generate etme

import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'content');

export function getDailyPaths() {
  const dailyDir = path.join(contentDirectory, 'daily');
  
  if (!fs.existsSync(dailyDir)) return [];
  
  const files = fs.readdirSync(dailyDir).filter(f => f.endsWith('.md'));
  
  const paths = [];
  files.forEach(file => {
    // Dosya adı: 2026-05-19-koc.md
    const parts = file.replace('.md', '').split('-');
    const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const sign = parts[3];
    
    paths.push({
      params: { date, sign }
    });
  });
  
  return paths;
}

export function getAllSigns() {
  return ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
          'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];
}

export function getAvailableDates() {
  const dailyDir = path.join(contentDirectory, 'daily');
  
  if (!fs.existsSync(dailyDir)) return [];
  
  const files = fs.readdirSync(dailyDir).filter(f => f.endsWith('.md'));
  
  const dates = [...new Set(
    files.map(f => {
      const parts = f.replace('.md', '').split('-');
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    })
  )].sort();
  
  return dates;
}
