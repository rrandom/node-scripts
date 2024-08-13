/**
 * tsx src/translate.ts english_subtitles.srt chinese_subtitles.srt bilingual_subtitles.srt
 */
import path from 'path';
import { Command } from 'commander';
import { loadSrt, saveSrt } from './lib/subtitle';

const program = new Command();

function srtTimeToMs(srtTime: string): number {
  const [hours, minutes, seconds] = srtTime.split(':');
  const [sec, ms] = seconds.split(',');
  return (+hours * 3600 + +minutes * 60 + +sec) * 1000 + +ms;
}

function mergeSubtitles(
  baseSubs: any[],
  additionalSubs: any[],
  bOnA = true
): any[] {
  // adjust the end time of the base subtitles
  for (let i = 0; i < baseSubs.length - 1; i++) {
    if (
      srtTimeToMs(baseSubs[i].endTime) > srtTimeToMs(baseSubs[i + 1].startTime)
    ) {
      baseSubs[i].endTime = baseSubs[i + 1].startTime;
    }
  }

  // merge the additional subtitles into the base
  let baseIndex = 0;
  additionalSubs.forEach((subB) => {
    const subBStartMs = srtTimeToMs(subB.startTime);

    let found = false;
    while (baseIndex < baseSubs.length) {
      const subA = baseSubs[baseIndex];
      const subAStartMs = srtTimeToMs(subA.startTime);
      const subAEndMs = srtTimeToMs(subA.endTime);

      if (subBStartMs >= subAStartMs && subBStartMs < subAEndMs) {
        // b means from subB
        subA.b = subB.text;
        found = true;
        baseIndex++;
        break;
      }

      baseIndex++;
    }

    if (!found) {
      baseSubs.push({
        id: baseSubs.length + 1,
        startTime: subB.startTime,
        endTime: subB.endTime,
        text: subB.text,
      });
    }
  });

  const result: any[] = [];
  let acc: string[] = [];
  let accEndTime = '';

  baseSubs.toReversed().forEach((sub) => {
    if (!sub.b) {
      if (!acc.length) {
        accEndTime = sub.endTime;
      }
      acc.unshift(sub.text);
    } else {
      if (acc.length) {
        sub.text = [sub.text, ...acc].join(' ');
        sub.endTime = accEndTime;
        acc = [];
      }
      result.push({
        ...sub,
        text: bOnA ? `${sub.b}\n${sub.text}` : `${sub.text}\n${sub.b}`,
      });
    }
  });

  return result.reverse().map((sub, index) => ({ ...sub, id: index + 1 }));
}

function processBilingualSubtitles(
  englishFile: string,
  chineseFile: string,
  outputFile: string
) {
  const englishSubs = loadSrt(englishFile);
  const chineseSubs = loadSrt(chineseFile);

  const baseSubs =
    englishSubs.length >= chineseSubs.length ? englishSubs : chineseSubs;
  const additionalSubs =
    englishSubs.length < chineseSubs.length ? englishSubs : chineseSubs;

  const alignedSubs = mergeSubtitles(
    baseSubs,
    additionalSubs,
    additionalSubs == chineseSubs
  );

  saveSrt(alignedSubs, outputFile);
}

// 命令行参数解析和执行
program
  .name('bilingual')
  .description(
    'Merge English and Chinese subtitles into a bilingual subtitle file'
  )
  .version('1.0.0')
  .argument('<englishFile>', 'Input English SRT file')
  .argument('<chineseFile>', 'Input Chinese SRT file')
  .argument('<outputFile>', 'Output Bilingual SRT file')
  .action((englishFile, chineseFile, outputFile) => {
    try {
      const eng = path.resolve(process.cwd(), englishFile);
      const ch = path.resolve(process.cwd(), chineseFile);
      processBilingualSubtitles(eng, ch, outputFile);
      console.log('Subtitles merged successfully!');
    } catch (error) {
      console.error('SubTitles merge fail:', error);
    }
  });

program.parse();
