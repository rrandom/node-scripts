import axios from 'axios';
import { Command } from 'commander';
import dotenv from 'dotenv';
import { loadSrt, saveSrt } from './lib/subtitle';

dotenv.config();

const program = new Command();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

async function translateText(
  text: string,
  context: string,
  targetLang: string = 'ZH'
): Promise<string> {
  const url = 'https://api-free.deepl.com/v2/translate';
  const params = new URLSearchParams({
    auth_key: DEEPL_API_KEY || '',
    text: text,
    context,
    target_lang: targetLang,
  });

  try {
    const response = await axios.post(url, params);
    return response.data.translations[0].text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
}

function getContext(subtitles: any[], index: number): string {
  const maxCount = 3;
  const maxLen = 5000;
  const timeGap = 5000;
  let context = '';

  if (
    index > 0 &&
    subtitles[index].startTime - subtitles[index - 1].endTime > 5000
  ) {
    return '';
  }

  for (let i = Math.max(0, index - maxCount); i < index; i++) {
    if (i > 0 && subtitles[i].startTime - subtitles[i - 1].endTime > timeGap) {
      break;
    }

    context += subtitles[i].text + ' ';
    if (context.length > maxLen) {
      break;
    }
  }

  return context.trim();
}

async function translateSrt(
  inputFile: string,
  outputFile: string,
  bilingual: boolean = false
) {
  const subtitles = loadSrt(inputFile);

  for (let i = 0; i < subtitles.length; i++) {
    const originalText = subtitles[i].text;
    const context = getContext(subtitles, i);
    const translatedText = await translateText(originalText, context);

    if (bilingual) {
      subtitles[i].text = `${originalText}\n${translatedText}`;
    } else {
      subtitles[i].text = translatedText;
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  saveSrt(subtitles, outputFile);
}

program
  .name('translate')
  .description('Translate subtitles using DeepL API')
  .version('1.0.0')
  .argument('<inputFile>', 'Input SRT file')
  .argument('<outputFile>', 'Output SRT file')
  .option('--bilingual', 'Generate bilingual subtitles')
  .action((inputFile, outputFile, options) => {
    translateSrt(inputFile, outputFile, options.bilingual)
      .then(() => console.log('Translation completed!'))
      .catch((error) => console.error('Translation Fail:', error));
  });

program.parse();
