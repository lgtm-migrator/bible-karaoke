import fs from 'fs';
import path from 'path';
import xml2json from 'xml-js';
import { ScriptLine } from '../cli/lib/import/hearThis/hearThisImport';

export function isDirectory(source: string): boolean {
  return fs.lstatSync(source).isDirectory();
}

export function getDirectories(source: string): string[] {
  return fs.readdirSync(source).filter((name) => isDirectory(path.join(source, name)));
}

export class Project {
  projectType: string;
  name: string;
  fullPath: string;
  books: Book[];

  constructor(projectType: string) {
    this.projectType = projectType;
    this.name = '';
    this.fullPath = '';
    this.books = [];
  }
}

export class Book {
  name: string;
  chapters: Chapter[];

  constructor() {
    this.name = '';
    this.chapters = [];
  }
}

export class Chapter {
  name: string;
  fullPath: string;
  audioFiles: string[];
  textXmlFile?: string;

  constructor() {
    this.name = '';
    this.fullPath = '';
    this.audioFiles = [];
    this.textXmlFile = '';
  }
}

export function getSampleVerses(sourceDirectory: string): string[] {
  try {
    const info = fs.readFileSync(path.join(sourceDirectory, 'info.xml'), 'utf8');
    const jsonInfo = JSON.parse(xml2json.xml2json(info, { compact: true }));
    let scriptLines = jsonInfo.ChapterInfo.Recordings.ScriptLine;
    // make sure ScriptLine is an array
    if (!Array.isArray(scriptLines)) {
      scriptLines = [scriptLines];
    }
    let verses = (scriptLines as ScriptLine[]).slice(0, 4).map((line: ScriptLine): string => {
      // Fix #20 : ignore Chapter Headings
      if (line.HeadingType?._text === 'c' && line.Verse._text === '0') {
        return '';
      }
      let text = line.Text._text;
      if (line.Heading._text === 'true') {
        text = `<strong>${text}</strong>`;
      }
      return text;
    });
    // remove any undefined or empty elements
    verses = verses.filter((v: string) => v);
    // only return 3
    if (verses.length > 3) verses.pop();
    return verses;
  } catch (err) {
    console.error('Failed to get sample verses', err);
    return ['Failed to get sample verses'];
  }
}
