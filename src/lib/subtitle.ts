import fs from 'fs';

import SrtParser from 'srt-parser-2';
const parser = new SrtParser();


export function loadSrt(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parser.fromSrt(content);
}

export function saveSrt(subtitles: any[], filePath: string) {
  const content = parser.toSrt(subtitles);
  fs.writeFileSync(filePath, content, 'utf-8');
}