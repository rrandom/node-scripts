import fs from 'fs';
import path from 'path';
import { Command } from 'commander';

const program = new Command();

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, 'zh-Hans-CN', { numeric: true });
}

function generateMarkdownTodo(dir: string, level = 0) {
  const items = fs.readdirSync(dir);

  items.sort(naturalSort);
  let markdown = '';

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const isDirectory = fs.lstatSync(itemPath).isDirectory();

    const indentation = ' '.repeat(level * 2);
    markdown += `${indentation}- [ ] ${item}\n`;

    if (isDirectory) {
      markdown += generateMarkdownTodo(itemPath, level + 1);
    }
  });

  return markdown;
}

program
  .name('dir2todo')
  .description('Print a directory tree as a markdown todo list')
  .version('1.0.0')
  .argument('<dir>', 'dir')
  .action((dir) => {
    const targetDir = path.resolve(process.cwd(), dir);
    const markdownTodoList = generateMarkdownTodo(targetDir);
    console.log(markdownTodoList);
  });

program.parse();
