import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { loadSrt } from './lib/subtitle';

const program = new Command();

function toText(inputFile: string, outputFile: string) {
  const subtitles = loadSrt(inputFile);
  const text = subtitles.map((sub) => sub.text).join(' ');
  fs.writeFileSync(outputFile, text, 'utf-8');
}

program
  .name('srt-to-text')
  .description('Convert SRT subtitles to a text file')
  .version('1.0.0')
  .argument('<inputFile>', 'Input SRT file')
  .argument('<outputFile>', 'Output text file')
  .action((inputFile, outputFile) => {
    const inputFilePath = path.resolve(process.cwd(), inputFile);
    const outputFilePath = path.resolve(process.cwd(), outputFile);
    toText(inputFilePath, outputFilePath);
  });

program.parse();
